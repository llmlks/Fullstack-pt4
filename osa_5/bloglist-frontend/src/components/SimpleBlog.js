import React from 'react'

const SimpleBlog = ({ blog, onClick }) => (
    <div>
        <div className="basicinfo">
            {blog.title} {blog.author}
        </div>
        <div className="likes">
            blog has {blog.likes} likes
            <button onClick={onClick}>Like</button>
        </div>
    </div>
)

export default SimpleBlog