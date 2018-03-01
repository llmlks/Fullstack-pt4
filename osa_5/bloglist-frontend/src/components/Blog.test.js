import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'

const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 7,
    user: {
        name: 'Robert DeNiro'
    }
}

describe('<Blog />', () => {
    it('renders the title and author by default', () => {
        const mockHandle = jest.fn()
        const blogComponent = shallow(<Blog blog={blog} likeHandler={mockHandle} />)

        const nameDiv = blogComponent.find('.blogName')
        const detailDiv = blogComponent.find('.blogDetails')

        expect(nameDiv.text()).toContain(blog.title)
        expect(nameDiv.text()).toContain(blog.author)
        expect(detailDiv.getElement().props.style).toEqual({ display: 'none' })
    })

    it('renders the blog details when name is clicked', () => {
        const mockHandle = jest.fn()
        const blogComponent = shallow(<Blog blog={blog} likeHandler={mockHandle} />)

        const nameDiv = blogComponent.find('.blogName')
        nameDiv.simulate('click')

        const detailDiv = blogComponent.find('.blogDetails')

        expect(detailDiv.text()).toContain(blog.user.name)
        expect(detailDiv.text()).toContain(blog.likes)
        expect(detailDiv.text()).toContain(blog.url)
        expect(detailDiv.getElement().props.style).toEqual({ display: '' })
    })

    it('doesn\'t render the details if the name is clicked twice', () => {
        const mockHandle = jest.fn()
        const blogComponent = shallow(<Blog blog={blog} likeHandler={mockHandle} />)

        const nameDiv = blogComponent.find('.blogName')
        nameDiv.simulate('click')
        nameDiv.simulate('click')

        const detailDiv = blogComponent.find('.blogDetails')

        expect(detailDiv.getElement().props.style).toEqual({ display: 'none' })        
    })

    it('doesn\'t render the delete button if no handler is passed', () => {
        const mockLikeHandle = jest.fn()
        const blogComponent = shallow(<Blog blog={blog} likeHandler={mockLikeHandle} />)

        const deleteButton = blogComponent.find('.deleteButton')

        expect(deleteButton.length).toBe(0)        
    })

    it('renders the delete button if handler is passed', () => {
        const mockLikeHandle = jest.fn()
        const mockDeleteHandle = jest.fn()
        const blogComponent = shallow(<Blog blog={blog} likeHandler={mockLikeHandle} deleteHandler={mockDeleteHandle} />)

        const deleteButton = blogComponent.find('.deleteButton')

        expect(deleteButton.length).toBe(1)
    })
})