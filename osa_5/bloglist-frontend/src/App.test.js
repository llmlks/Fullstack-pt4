import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
jest.mock('./services/blogs')
import blogService from './services/blogs'
import login from './services/login';

describe('<App />', () => {
    let app

    describe('when no user is logged in', () => {

        beforeEach(() => {
            localStorage.removeItem('loggedInUser')
            app = mount(<App />)
        })

        it('renders only login form if no user logged in', () => {
            app.update()
            const blogComponents = app.find(Blog)
            const createBlogFormComponent = app.find(CreateBlogForm)
            const loginFormComponent = app.find(LoginForm)
            const notificationComponent = app.find(Notification)

            expect(blogComponents.length).toBe(0)
            expect(createBlogFormComponent.length).toBe(0)
            expect(loginFormComponent.length).toBe(1)
            expect(notificationComponent.length).toBe(1)
        })
    })

    describe('when user is logged in', () => {

        beforeEach(() => {
            const testUser = blogService.testUser

            const user = {
                username: testUser.username,
                name: testUser.name,
                token: testUser.token
            }

            localStorage.setItem('loggedInUser', JSON.stringify(user))

            app = mount(<App />)
        })

        it('renders all blogs received from backend when user logged in', () => {
            app.update()
            const blogComponents = app.find(Blog)
            const createBlogFormComponent = app.find(CreateBlogForm)
            const loginFormComponent = app.find(LoginForm)
            const notificationComponent = app.find(Notification)

            expect(blogComponents.length).toBe(blogService.blogs.length)
            expect(createBlogFormComponent.length).toBe(1)
            expect(loginFormComponent.length).toBe(0)
            expect(notificationComponent.length).toBe(1)
        })
    })
})