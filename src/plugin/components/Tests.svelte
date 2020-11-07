<script>
    import { runAllTests } from "tests/tests.js";

    function run() {
        const results = runAllTests();
        output.push(...results);
    }

    const output = [];

</script>

<button on:click={run}>Run Tests</button>

