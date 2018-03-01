import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
	token = `Bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (newBlog) => {
	const config = {
		headers: { 'Authorization': token }
	}

	const response = await axios.post(baseUrl, newBlog, config)
	return response.data
}

const update = async (updatedBlog) => {
	const config = {
		headers: { 'Authorization': token }
	}

	const newBlog = {
		user: updatedBlog.user.id,
		title: updatedBlog.title,
		author: updatedBlog.author,
		url: updatedBlog.url,
		likes: updatedBlog.likes
	}

	const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, newBlog, config)
	return response.data
}

const deleteBlog = async (blogId) => {
	const config = {
		headers: { 'Authorization': token }
	}

	const response = await axios.delete(`${baseUrl}/${blogId}`, config)
	return response.data
}

export default { setToken, getAll, create, update, deleteBlog }