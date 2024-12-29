import { performance } from "perf_hooks";

export async function measurePerformance(
    callback: () => Promise<any>,
    title: string,
    verbose: boolean = true
): Promise<any> {
    const start = performance.now();
    const res = await callback();
    const end = performance.now();

    if (verbose) {
        console.log(
            `${title} took ${((end - start) / 1000).toFixed(2)} seconds`
        );
    }

    return res;
}
