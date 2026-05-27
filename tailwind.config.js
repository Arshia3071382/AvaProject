    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            'primary-green': '#02816E', 
            "light-green" : '#00BA9F' ,
          },
        },
      },
      plugins: [],
    }
