(function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function subscribe(component, store, callback) {
        const unsub = store.subscribe(callback);
        component.$$.on_destroy.push(unsub.unsubscribe
            ? () => unsub.unsubscribe()
            : unsub);
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.shift()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            while (render_callbacks.length) {
                const callback = render_callbacks.pop();
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_render);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_render.forEach(add_render_callback);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_render } = component.$$;
        fragment.m(target, anchor);
        // onMount happens after the initial afterUpdate. Because
        // afterUpdate callbacks happen in reverse order (inner first)
        // we schedule onMount callbacks before afterUpdate callbacks
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_render.forEach(add_render_callback);
    }
    function destroy(component, detaching) {
        if (component.$$) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal: not_equal$$1,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_render: [],
            after_render: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_render);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                $$.fragment.l(children(options.target));
            }
            else {
                $$.fragment.c();
            }
            if (options.intro && component.$$.fragment.i)
                component.$$.fragment.i();
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy(this, true);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (!stop) {
                    return; // not ready
                }
                subscribers.forEach((s) => s[1]());
                subscribers.forEach((s) => s[0](value));
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                }
            };
        }
        return { set, update, subscribe };
    }

    var fonts = readable({ firstRender: true}, set => {

      const title = "hello world";
      const firstRender = false;
      
      window.setTimeout(() => set({ firstRender, title, }), 5000);
      
      const stop = () => false;

      return stop;
    });

    /* src\App.html generated by Svelte v3.4.4 */

    function create_fragment(ctx) {
    	var section, h1, t0_value = ctx.$fonts.title, t0, t1, p0, t3, p1;

    	return {
    		c() {
    			section = element("section");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Svelte is rendered and firebase is initialized!";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "You'll want to start adding components for yourself.";
    			h1.className = "svelte-whwxyk";
    			section.className = "svelte-whwxyk";
    		},

    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, h1);
    			append(h1, t0);
    			append(section, t1);
    			append(section, p0);
    			append(section, t3);
    			append(section, p1);
    		},

    		p(changed, ctx) {
    			if ((changed.$fonts) && t0_value !== (t0_value = ctx.$fonts.title)) {
    				set_data(t0, t0_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d(detaching) {
    			if (detaching) {
    				detach(section);
    			}
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let $fonts;

    	subscribe($$self, fonts, $$value => { $fonts = $$value; $$invalidate('$fonts', $fonts); });

    	return { $fonts };
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    /* src\components\Loading.html generated by Svelte v3.4.4 */

    function create_fragment$1(ctx) {
    	var section, div0, svg, circle, t0, div1, p, t1, current;

    	const default_slot_1 = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_1, ctx, null);

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			t0 = space();
    			div1 = element("div");

    			if (!default_slot) {
    				p = element("p");
    				t1 = text(ctx.text);
    			}

    			if (default_slot) default_slot.c();
    			attr(circle, "class", "loader-path svelte-14b468");
    			attr(circle, "cx", "50");
    			attr(circle, "cy", "50");
    			attr(circle, "r", "20");
    			attr(circle, "fill", "none");
    			attr(circle, "stroke", ctx.color);
    			attr(circle, "stroke-width", "2");
    			attr(svg, "class", "loader svelte-14b468");
    			attr(svg, "viewBox", "25 25 50 50");
    			div0.className = "icon";

    			div1.className = "message svelte-14b468";
    			section.className = "loading svelte-14b468";
    		},

    		l(nodes) {
    			if (default_slot) default_slot.l(div1_nodes);
    		},

    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(div0, svg);
    			append(svg, circle);
    			append(section, t0);
    			append(section, div1);

    			if (!default_slot) {
    				append(div1, p);
    				append(p, t1);
    			}

    			else {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},

    		p(changed, ctx) {
    			if (!current || changed.color) {
    				attr(circle, "stroke", ctx.color);
    			}

    			if (!default_slot) {
    				if (!current || changed.text) {
    					set_data(t1, ctx.text);
    				}
    			}

    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
    			}
    		},

    		i(local) {
    			if (current) return;
    			if (default_slot && default_slot.i) default_slot.i(local);
    			current = true;
    		},

    		o(local) {
    			if (default_slot && default_slot.o) default_slot.o(local);
    			current = false;
    		},

    		d(detaching) {
    			if (detaching) {
    				detach(section);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { color = "#666", text = "Loading..." } = $$props;

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return { color, text, $$slots, $$scope };
    }

    class Loading extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["color", "text"]);
    	}
    }

    const appLoader = new Loading({
      target: document.querySelector("main#app"),
      props: {
        color: "#2ad",
        text: "Starting your app",
      },
    });

    // we only show the loading until the first render.
    let app = null;


    const unsubscribe = fonts.subscribe(value => {

      // we wait until connected to firebase to stop showing the loading screen
      if (value.firstRender) {

        app = new App({
          target: document.querySelector("main#app"),
          // we could pass props from 'value' here, if needed
        });

        appLoader.$destroy();
      }

      // app.$set( ... )
      // we could update app with props from our app, if needed.
    });

}());
