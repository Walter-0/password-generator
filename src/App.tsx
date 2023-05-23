import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import copyIcon from "./images/copy-icon.svg";

interface IFormInputs {
  characterLength: number;
  includeUppercaseLetters: boolean;
  includeLowercaseLetters: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

enum PasswordStrength {
  Weak,
  Fair,
  Medium,
  Strong,
  VeryStrong,
}

const copyToClipboard = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  console.log("Copied to clipboard");
};

function App() {
  const { register, handleSubmit } = useForm<IFormInputs>();

  const [password, setPassword] = useState<string>("");
  const [characterLength, setCharacterLength] = useState<number>(8);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;
    // Add one point for each of the following:
    // - password length is at least 8 characters
    // - password contains uppercase letters
    // - password contains numbers
    // - password contains symbols

    if (password.length >= 8) {
      strength += 1;
    }

    if (password.match(/[A-Z]+/)) {
      strength += 1;
    }

    if (password.match(/[0-9]+/)) {
      strength += 1;
    }

    if (password.match(/[$@#&!]+/)) {
      strength += 1;
    }

    setPasswordStrength(() => strength);
  };

  const generatePassword = (data: IFormInputs) => {
    const {
      characterLength,
      includeUppercaseLetters,
      includeLowercaseLetters,
      includeNumbers,
      includeSymbols,
    } = data;

    let characterList: string = "";

    if (includeUppercaseLetters) {
      characterList += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (includeLowercaseLetters) {
      characterList += "abcdefghijklmnopqrstuvwxyz";
    }

    if (includeNumbers) {
      characterList += "0123456789";
    }

    if (includeSymbols) {
      characterList += "!@#$%^&*()_+";
    }

    let password = "";

    for (let i = 0; i < characterLength; i++) {
      const characterIndex = Math.round(Math.random() * characterList.length);
      password += characterList.charAt(characterIndex);
    }

    setPassword(() => password);
    evaluatePasswordStrength(password);
  };

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
    generatePassword(data);
  };

  return (
    <div className="App flex h-screen flex-col items-center justify-center">
      <h1>Password Generator</h1>

      <div>
        <input type="text" value={password} readOnly />
        <img
          src={copyIcon}
          className="inline w-6 cursor-pointer"
          alt="Copy"
          onClick={() => copyToClipboard(password)}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Character Length
            <span className="float-right">{characterLength}</span>
            <input
              {...register("characterLength")}
              className="block w-full"
              onChange={(e) => setCharacterLength(+e.target.value)}
              type="range"
              min="1"
              max="32"
              defaultValue={8}
              size={32}
            />
          </label>
        </div>

        <div>
          <label>
            <input {...register("includeUppercaseLetters")} type="checkbox" />
            Include Uppercase Letters
          </label>
        </div>

        <div>
          <label>
            <input {...register("includeLowercaseLetters")} type="checkbox" />
            Include Lowercase Letters
          </label>
        </div>

        <div>
          <label>
            <input {...register("includeNumbers")} type="checkbox" />
            Include Numbers
          </label>
        </div>

        <div>
          <label>
            <input {...register("includeSymbols")} type="checkbox" />
            Include Symbols
          </label>
        </div>

        <div>
          <span>Strength</span>
          <PasswordStrengthIndicator strength={passwordStrength} />
        </div>

        <div>
          <button type="submit">Generate Password</button>
        </div>
      </form>
    </div>
  );
}

const PasswordStrengthIndicator = (props: { strength: number }) => {
  const { strength } = props;
  let bars = [];

  for (let i = 0; i < strength; i++) {
    bars.push(
      <div key={i} className="inline-block h-1 w-4 bg-green-500"></div>
    );
  }
  return (
    <div>
      <span>{PasswordStrength[strength]}</span>
      <div className="inline-flex space-x-1">{bars}</div>
    </div>
  );
};

export default App;
