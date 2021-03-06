import Login from '@/views/Login.vue'
import { mount } from '@vue/test-utils'
import { createStore } from '@/store'
import router from '@/router'

//Redirect
//button-click (overlap med vuex?)
//Riktig navn vises
//Login funker når bruker finnes
//Vuex
//Register link appears when invalid is true

function mountLogin(config = {}) {
    config.mountOptions = config.mountOptions || {}
    config.plugins = config.plugins || {}
    return mount(Login, {
      global: {
        plugins: [
          createStore(config.plugins.store), 
          router
        ]
      },
      ...config.mountOptions
    })
}

let wrapper

describe('Login', () => {
    test('User is redirected to home when login is valid', async () => {
        wrapper = mountLogin({
            plugins: [{
                store: {
                    state: () => ({
                        username: 'Ole',
                        password: 'Ole123'
                    })
                },
            }, router]
        })

        const usernameInput = wrapper.find('[data-test="username"]')
        const passwordInput = wrapper.find('[data-test="password"]')
        
        await usernameInput.setValue("Ole")
        await passwordInput.setValue("Ole123")
        await wrapper.find('[data-test="form"]').trigger('submit')

        expect(window.location.href).toEqual("http://localhost/")
    }),
    test('User is not redirected when login is invalid', async () => {
        wrapper = mountLogin({
            plugins: [{
                store: {
                    state: () => ({
                        username: 'Ole',
                        password: 'Ole123'
                    })
                },
            }, router]
        })

        const usernameInput = wrapper.find('[data-test="username"]')
        const passwordInput = wrapper.find('[data-test="password"]')
        
        await usernameInput.setValue("Ole")
        await passwordInput.setValue("Ole1234")
        await wrapper.find('[data-test="form"]').trigger('submit')

        expect(window.location.href).toEqual("http://localhost/login")
    }),
    test('Signup button is not shown before user attempts to log in', () => {
        wrapper = mountLogin({
            plugins: [{
                store: {
                    state: () => ({
                        username: 'Ole',
                        password: 'Ole123'
                    })
                },
            }, router]
        })

        expect(wrapper.find("register").exists()).toBe(false)
    }),
    test('Signup button is shown after failed login attempt', async () => {
        wrapper = mountLogin({
            plugins: [{
                store: {
                    state: () => ({
                        username: 'Ole',
                        password: 'Ole123'
                    })
                },
            }, router]
        })

        const usernameInput = wrapper.find('[data-test="username"]')
        const passwordInput = wrapper.find('[data-test="password"]')
        
        await usernameInput.setValue("Ole")
        await passwordInput.setValue("Ole1234")
        await wrapper.find('[data-test="form"]').trigger('submit')

        expect(wrapper.html()).toContain("register")
    })
})
