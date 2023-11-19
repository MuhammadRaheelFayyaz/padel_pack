module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        fontFamily: {
            sans: ["Poppins", 'sans-serif'],
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                lg: '2rem',
                '2xl': '4rem',
            },
        },
        extend: {
            colors: {
                primary: '#F7F72C',
                secondary: '#46C410',
                'theme-dark': '#090B0C',
                'theme-dark-blue': '#012242',
                'green-lemon': '#46C410',
            }
        },
    },
 };