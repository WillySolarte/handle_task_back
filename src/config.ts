import {registerAs} from '@nestjs/config'

export default registerAs('config', () => {
    return {
        DATA_BASE_URL: process.env.DATA_BASE_URL
    };
});