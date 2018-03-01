import React from 'react'
import PropTypes from 'prop-types'

class Blog extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
			blog: props.blog,
			visible: false,
			likeHandler: props.likeHandler,
			deleteHandler: props.deleteHandler
		}
	}

	toggleVisibility = () => {
		this.setState({
			visible: !this.state.visible
		})
	}

	render() {
		const style = { display: this.state.visible ? '' : 'none' }
		const blog = this.state.blog
		const deleteButton = () => {
			return (
				<button className="deleteButton" onClick={this.state.deleteHandler}>Delete</button>
			)
		}

		return (
			<div className="blog">
				<div className="blogName" onClick={this.toggleVisibility}>
					{blog.title} {blog.author}
				</div>
				<div className="blogDetails" style={style}>
					<a href={blog.url}>{blog.url}</a>
					<p>
						{blog.likes} likes
						<button onClick={this.state.likeHandler}>
							Like
						</button>
					</p>
					<p>
						Added by {blog.user.name}
					</p>
					{this.state.deleteHandler !== null
						&& this.state.deleteHandler !== undefined
						&& deleteButton()}
				</div>
			</div>
		)
	}
}

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	likeHandler: PropTypes.func.isRequired
}

export default Blog