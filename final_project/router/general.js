// Get books by author using async/await with Axios
const getBooksByAuthorAxios = async (author) => {
try {
const response = await axios.get(${BASE_URL}/author/${encodeURIComponent(author)});
return response.data;
} catch (error) {
throw new Error(Error fetching books by author: ${error.message});
}
};

// Get books by title using async/await with Axios
const getBooksByTitleAxios = async (title) => {
try {
const response = await axios.get(${BASE_URL}/title/${encodeURIComponent(title)});
return response.data;
} catch (error) {
throw new Error(Error fetching books by title: ${error.message});
}
};

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
