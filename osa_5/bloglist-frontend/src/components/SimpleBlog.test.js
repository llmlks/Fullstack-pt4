import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 7
}

describe('<SimpleBlog />', () => {

    it('renders title and author', () => {
        const simpleBlogComponent
            = shallow(<SimpleBlog blog={blog} onClick={null} />)

        const basicInfoDiv = simpleBlogComponent.find('.basicinfo')

        expect(basicInfoDiv.text()).toContain(blog.title)
        expect(basicInfoDiv.text()).toContain(blog.author)
        expect(basicInfoDiv.text()).not.toContain(blog.url)
    })

    it('render likes', () => {
        const simpleBlogComponent
            = shallow(<SimpleBlog blog={blog} onClick={null}/>)

        const likesDiv = simpleBlogComponent.find('.likes')

        expect(likesDiv.text()).toContain(`blog has ${blog.likes} likes`)
    })

    it('calls clickHandler twice when button is pressed two times', () => {
        const mockOnClick = jest.fn()

        const simpleBlogComponent
            = shallow(<SimpleBlog blog={blog} onClick={mockOnClick} />)

        const button = simpleBlogComponent.find('button')
        button.simulate('click')
        button.simulate('click')

        expect(mockOnClick.mock.calls.length).toBe(2)
    })
})