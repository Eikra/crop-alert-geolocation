"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = void 0;
const redis_1 = require("redis");
exports.RedisProvider = {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
        const client = (0, redis_1.createClient)({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
            },
        });
        await client.connect();
        return client;
    },
};
//# sourceMappingURL=redis.provider.js.map