import React from 'react'

const CreateBlogForm = ({ title, author, url, fieldHandler, createHandler }) => {
    return (
        <form onSubmit={createHandler}>
            <h4>Create new blog</h4>

            <div>
                Title:
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={fieldHandler}
                />
            </div>

            <div>
                Author:
                <input
                    type="text"
                    name="author"
                    value={author}
                    onChange={fieldHandler}
                />
            </div>

            <div>
                URL:
                <input
                    type="text"
                    name="url"
                    value={url}
                    onChange={fieldHandler}
                />
            </div>

            <button type="submit">
                Create
            </button>
        </form>
    )
}

export default CreateBlogForm