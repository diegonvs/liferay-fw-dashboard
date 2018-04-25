const generateRandomString = () => {return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);}

const generateRandomNumber = () => {return Math.round(Math.random() * 100);};


export default function getRandomData() {
    return {
        name: generateRandomString(),
        value: JSON.stringify(generateRandomNumber())
    }
}