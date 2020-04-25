import axios from 'axios';
export default {
	fetch: (path, method, data) => {
		return axios(path, {
			method: method,
			data: data
		})
	}
};
