import axios from "axios";

// export const BASE_URL = "http://localhost:5036/";
export const BASE_URL = "https://quizapibackend20241029100753.azurewebsites.net/";

export const ENDPOINTS = {
    participant: 'Participant',
    question: 'Question',
    getAnswers: 'Question/getAnswers',
    questionsByCategory: 'Question/ByCategory', // New endpoint for fetching by category
};

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + 'api/' + endpoint + '/';
    return {
        fetch: () => axios.get(url),
        fetchById: (id) => axios.get(url + id),
        create: (newRecord) => axios.post(url, newRecord),  
        update: (id, updateRecord) => axios.put(url + id, updateRecord), 
        delete: (id) => axios.delete(url + id),
        fetchByCategory: (category) => axios.get(`${BASE_URL}api/Question/ByCategory/${category}`) // New method for fetching by category
    };
};
