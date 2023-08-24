import Input from './Input'
import Card from './Card'
import { useState, useRef } from 'react'
import {captchas} from './Captcha'
import { puzzles } from './ChessPuzzles'
import Maps from './Maps'
import { LoadScript } from '@react-google-maps/api'

interface Question {
    id: number;
    text: string;
    refresh?: Function;
    isTrue: (inputValue: string) => boolean
}

export default function Home(){
    //TODO
    //INDEX into Questions to conditionally render questions based on order


    const [passwordInput, setPasswordInput] = useState('')

    const randomIndex = () => {
        return Math.floor(Math.random() * captchas.length)
    }

    const index = randomIndex()

    const indexRef = useRef(index)

    const refreshIndex = () => {
        indexRef.current = randomIndex()
    }

    function isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
    }

    const questions: Question[] = [
        {
            id: 0,
            text: 'Your password must be at least 5 characters',
            isTrue: (inputValue): boolean => inputValue.length >= 5
        },
        {
            id: 1,
            text: 'Your password must contain a number',
            isTrue: (inputValue): boolean => {
                for(let i = 0; i < inputValue.length; i++) {
                    let code = inputValue.charCodeAt(i);
                    if((code > 47 && code < 58)) return true
                }
                return false
            }
        },
        {
            id: 2,
            text: 'Your password must contain a special character',
            isTrue: (inputValue): boolean => {
                for(let i = 0; i < inputValue.length; i++) {
                    let code = inputValue.charCodeAt(i);
                    if(!(code > 47 && code < 58) &&
                    !(code > 64 && code < 91) &&
                    !(code > 96 && code < 123)) return true
                }
                return false
            }
        },
        {
            id: 3,
            text: 'Your password must contain an uppercase letter',
            isTrue: (inputValue): boolean => {
                for(let i = 0; i < inputValue.length; i++){
                    let code = inputValue.charCodeAt(i);
                    if((code > 64 && code < 91)) return true
                }
                return false
            }
        },
        {
            id: 4,
            text: 'The digits in your password must add up to 25',
            isTrue: (inputValue): boolean => {
                let total = 0
                for(let i = 0; i < inputValue.length; i++){
                    let number = inputValue.charCodeAt(i)
                    if(number > 47 && number < 58){
                        const digitValue = number - 48
                        total += digitValue
                    }
                    if(total === 25){
                        return true
                    }
                }
                return false

            }
        },
        {
            id: 5,
            text: 'Your password must include a month of the year',
            isTrue: (inputValue): boolean => {
                const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
                
                const lowerCaseInput = inputValue.toLowerCase()
                for(const month of months){
                    if(lowerCaseInput.includes(month)){
                        return true
                    }
                }
                return false
            }
        },
        {
            id: 6,
            text: 'Your password must include one of our sponsors:',
            isTrue: (inputValue): boolean => {
                const sponsors = ['pepsi', 'starbucks', 'shell']

                const lowerCaseInput = inputValue.toLowerCase()
                for(const sponsor of sponsors){
                    if(lowerCaseInput.includes(sponsor)){
                        return true
                    }
                }
                return false
            }
        },
        {
            id: 7,
            text: 'The roman numerals in your password should multiply to 35',
            isTrue: (inputValue): boolean => {
                return checkRomanValue(inputValue)
            }
        },
        {
            id: 8,
            text: `Your password must include this CAPTCHA: ${captchas[indexRef.current].val}`,
            refresh: refreshIndex,
            isTrue: (inputValue): boolean => {

                if(inputValue.includes(captchas[indexRef.current].val)){
                    return true
                }
                return false
            }
        },
        {
            id: 9,
            text: 'Your password must include today\'s wordle answer',
            isTrue: (inputValue): boolean => {
                return true
            }
        },
        {
            id: 10,
            text: 'Your password must include a two letter symbol from the periodic table',
            isTrue: (inputValue): boolean => {

                const elements = ['He', 'Li', 'Be', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'Cl', 'Ar', 'Ca', 'Sc', 'Ti', 'Cr', 'Mn', 'Fe', 'Co', 
                'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 
                'In', 'Sn', 'Sb', 'Te', 'Xe', 'Cs', 'Ba', 'La', 'Hf', 'Ta', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 
                'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
                'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Th', 'Pa', 'Np', 'Pu', 'Am', 'Cm', 
                'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr'
                ]

                for(const element of elements){
                    if(inputValue.includes(element)){
                        return true
                    }
                }
                return false
            }
        },
        {
            id: 11,
            text: 'Your password must include the current phase of the moon as an emoji',
            isTrue: (inputValue): boolean => {
                return true
            }
        },
        {
            id: 12,
            text: 'Your password must include a leap year',
            isTrue: (inputValue): boolean => {
                let currentNumber = ''
                let hasLeapYear = false

                for(const c of inputValue) {
                    if(!isNaN(parseInt(c))){
                        currentNumber += c
                        const num = parseInt(currentNumber)
                        if(isLeapYear(num)){
                            hasLeapYear = true
                            break
                        }
                        currentNumber = ''
                    }
                } 
                return hasLeapYear
            }
        },
        {
            id: 13,
            text: 'Your password must include the best move in algebraic chess notation',
            isTrue: (inputValue): boolean => {
                for(const puzzle of puzzles){
                    if(inputValue.includes(puzzle.val)){
                        return true
                    }
                }
                return false
            }
        },
        {
            id: 14,
            text: '🥚 - This is my chicken Paul, He hasn\'t hatched yet, please put him in your password and keep him safe.',
            isTrue: (inputValue): boolean => {
                if(inputValue.includes('🥚')){
                    return true
                }
                return false
            }
        },
        {
            id: 15,
            text: 'The elements in your password must have atomic numbers that add up to 200',
            isTrue: (inputValue) => {

                let result = 0

                const elementsArr = checkElementVal(inputValue)

                for(const element of elementsArr){
                    result += elementToAtomic(element)
                }
                console.log(result)
                return result === 200
            } 
        }
    ]

    function elementToAtomic(element: string): number {
        const elementToNumber : { [key: string] : number } = {
            H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10
        }

        let atomicNumber = elementToNumber[element]

        return atomicNumber

    }

    function checkElementVal(inputString: string) {
        // Search by two chars

        const elements : string[] = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F' , 'Ne']
        const elementArr : string[] = []

        let i = 0;
        while( i < inputString.length){
            let found = false
            for(let j = elements.length - 1; j >= 0; j--){
                const element = elements[j]
                if(inputString.startsWith(element, i)){
                    elementArr.push(element)
                    i += element.length
                    found = true
                    break
                }
            }
            if(!found){
                i++
            }
        }
        console.log(elementArr)
        return elementArr

    }

    function isRomanNumeral(char: string): boolean {
        const romanNumerals = ["I", "V", "X", "L", "C", "D", "M"];
        return romanNumerals.includes(char);
    }
    
    function romanToNumber(roman: string): number {
        const romanToValue: { [key: string]: number } = {
            I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
        };
    
        let result = 0;
    
        for (let i = 0; i < roman.length; i++) {
            const current = romanToValue[roman[i]];
            const next = romanToValue[roman[i + 1]];
    
            if (next && current < next) {
                result += next - current;
                i++;
            } else {
                result += current;
            }
        }
    
        return result;
    }
    
    function calculateProduct(romanChars: string[]): number {
        let product = 1;
    
        let repeatCount = 1;
        let prevChar = '';
    
        for (const char of romanChars) {
            if (char === prevChar) {
                repeatCount++;
            } else {
                repeatCount = 1;
            }
    
            if (repeatCount > 1) {
                product /= romanToNumber(prevChar)
                product += romanToNumber(char) * repeatCount;
            } else {
                product *= romanToNumber(char);
            }
    
            prevChar = char;
        }
    
        return product;
    }
    
    function checkRomanValue(inputString: string): boolean {
        const romanChars: string[] = [];
    
        for (const char of inputString) {
            if (isRomanNumeral(char)) {
                romanChars.push(char);
            }
        }

        const product = calculateProduct(romanChars);
    
        return product === 35;
    }


    const isQConditionMet = (question: Question) => {
        return question.isTrue(passwordInput)
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        setPasswordInput(e.target.value)
    }

    return (
        <>
            {/* <LoadScript googleMapsApiKey={import.meta.env.VITE_REACT_APP_GOOGLE_KEY} libraries={['places']}>
                <Maps />
            </LoadScript> */}
            <h1>* The Password Game</h1>
            <div>
                <h3 className='text-3xl font-bold underline'>Please choose a password</h3>
                <Input value={passwordInput} onChange={handleInputChange} />
                <ul> 
                    {questions.map((q) =>{ 
                    if(!isQConditionMet(q)){
                        return (
                            <li key={q.id}>
                                <Card question={q.text}/>
                                {/* move rendering to Card component */}
                                {q.refresh && <button onClick={() => refreshIndex()}>Click Me</button>}
                            </li>
                        )
                    }
                    }
                    )}
                </ul>
            </div>
        </>
    )
}