import { BASE_API_URL } from "path_to_constant.js_file";
import { BASE_API_URL } from "path_to_constant.js_file";

Whenever you're making an API call, never hardcode the API URL, instead, create src/utils/constants.js or a similar file and add the API URL inside it like this:

export const BASE_API_URL = "http:// localhost :5000/api";

and wherever you want to make an API call, just use that constant using template literal syntax like this:

// posts.jsx


const {data} = await axios.get(`${BASE_API_URL}/posts`);

// users.jsx


const {data} = await axios.get(`${BASE_API_URL}/users`);

And with this change, If later you want to change the BASE_API_URL value to something else like just /api, then you don't need to change it in multiple files.

You just need to update it in the constants.js file, it will get reflected everywhere.
