import { query } from "./_generated/server";

export const testFunc = query({
    args: {},
    handler: async () => {
        return "Hello from valid Convex function";
    },
});
