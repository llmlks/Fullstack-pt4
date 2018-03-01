import React from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			blogs: [],
			user: null,
			username: '',
			password: '',
			title: '',
			author: '',
			url: '',
			message: null,
			messageType: null
		}
	}

	async componentDidMount() {
		const blogs = await blogService.getAll()

		this.setState({
			blogs: blogs.sort((a, b) => {
				return b.likes - a.likes
			})
		})

		const loggedInUser = window.localStorage.getItem('loggedInUser')
		if (loggedInUser) {
			const user = JSON.parse(loggedInUser)
			this.setState({ user })
			blogService.setToken(user.token)
		}
	}

	handleFieldChange = (event) => {
		this.setState({ [event.target.name]: event.target.value })
	}

	login = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username: this.state.username,
				password: this.state.password
			})

			this.setState({
				username: '',
				password: '',
				user
			})

			this.displayMessage('Login successful!', 'success')

			window.localStorage.setItem('loggedInUser', JSON.stringify(user))
			blogService.setToken(user.token)
		} catch (exception) {
			this.displayMessage('Wrong username or password', 'error')
		}
	}

	logout = () => {
		this.displayMessage('Logout successful!', 'success')
		window.localStorage.removeItem('loggedInUser')
		this.setState({ user: null })
	}

	createBlog = async (event) => {
		event.preventDefault()

		const newBlog = {
			title: this.state.title,
			author: this.state.author,
			url: this.state.url
		}

		try {
			const created = await blogService.create(newBlog)

			this.setState({
				blogs: this.state.blogs.concat(created),
				title: '',
				author: '',
				url: ''
			})

			this.displayMessage(`A new blog ${created.title} by ${created.author} added!`, 'success')
		} catch (exception) {
			this.displayMessage('Creating a new blog failed.', 'error')
		}
	}

	likeABlog = (id) => {
		return async (event) => {
			event.preventDefault()

			const oldBlog = this.state.blogs.filter(b => b.id === id)[0]
			const updatedBlog = oldBlog
			updatedBlog.likes += 1

			try {
				await blogService.update(oldBlog)

				this.setState({
					blogs: this.state.blogs.map(blog => blog.id === id ? updatedBlog : blog).sort((a, b) => {
						return b.likes - a.likes
					})
				})
			} catch (exception) {
				this.displayMessage('Error occurred while updating blog', 'error')
			}
		}
	}

	deleteBlog = (blogToDelete) => {
		return async (event) => {
			event.preventDefault()

			if (window.confirm(`Are you sure you want to delete '${blogToDelete.title}' by ${blogToDelete.author}?`)) {
				try {
					await blogService.deleteBlog(blogToDelete.id)

					this.setState({
						blogs: this.state.blogs.filter(blog => blog.id !== blogToDelete.id)
					})

					this.displayMessage(`Blog '${blogToDelete.title}' by ${blogToDelete.author} deleted`, 'success')
				} catch (exception) {
					this.displayMessage('Couldn\'t delete the blog.', 'error')
				}
			}
		}
	}

	displayMessage = (message, type) => {
		this.setState({
			message: message,
			messageType: type
		})
		setTimeout(() => {
			this.setState({
				message: null,
				messageType: null
			})
		}, 3000)
	}

	render() {

		const loginForm = () => {
			return (
				<LoginForm
					username={this.state.username}
					password={this.state.password}
					loginHandler={this.login}
					fieldHandler={this.handleFieldChange}
				/>
			)
		}

		const blogList = () => {
			const isDeletable = (blog) => {
				return blog.user === null
					|| blog.user === undefined
					|| blog.user.username === this.state.user.username
			}

			return (
				<div>
					<p>
						{this.state.user.name} logged in
						<button type="submit" onClick={this.logout}>
							Log out
						</button>
					</p>

					<Togglable buttonLabel="Create new blog">
						<CreateBlogForm
							title={this.state.title}
							author={this.state.author}
							url={this.state.url}
							fieldHandler={this.handleFieldChange}
							createHandler={this.createBlog}
						/>
					</Togglable>

					<p></p>

					{this.state.blogs.map(blog =>
						<Blog
							key={blog.id}
							blog={blog}
							likeHandler={this.likeABlog(blog.id)}
							deleteHandler={isDeletable(blog) ? this.deleteBlog(blog) : null}>
						</Blog>
					)}
				</div>
			)
		}

		return (
			<div>
				<h2>Blogs</h2>

				<Notification message={this.state.message} type={this.state.messageType} />

				{this.state.user === null
					? loginForm()
					: blogList()}
			</div>
		)
	}
}

export default App