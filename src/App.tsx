import React, { useState } from "react";
import { useForm } from "react-hook-form";
import copyIcon from "./images/copy-icon.svg";
import "./App.css";

interface IFormInputs {
  characterLength: number;
  includeUppercaseLetters: boolean;
  includeLowercaseLetters: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const passwordStrengths: { [key: string]: { text: string; color: string } } = {
  "0": {
    text: "Weak",
    color: "bg-red-500",
  },
  "1": {
    text: "Weak",
    color: "bg-red-500",
  },
  "2": {
    text: "Fair",
    color: "bg-orange-500",
  },
  "3": {
    text: "Medium",
    color: "bg-soft-yellow",
  },
  "4": {
    text: "Strong",
    color: "bg-green-500",
  },
};

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
    <div className="App m-auto flex max-w-2xl flex-col items-center space-y-8 px-8 pt-24">
      <h1 className="text-2xl text-medium-gray">Password Generator</h1>

      <div className="w-full bg-dark-gray-blue p-8">
        <input
          type="text"
          className="w-2/3 overflow-x-scroll bg-transparent text-3xl text-off-white"
          value={password}
          readOnly
        />
        <img
          src={copyIcon}
          className="float-right inline w-8 cursor-pointer hover:opacity-25"
          alt="Copy"
          onClick={() => copyToClipboard(password)}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-dark-gray-blue p-8"
      >
        <div className="mb-12">
          <label className="text-2xl text-off-white">
            Character Length
            <span className="float-right text-4xl text-light-green">
              {characterLength}
            </span>
            <input
              {...register("characterLength")}
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
          <label className="custom-checkbox-contain">
            <input {...register("includeUppercaseLetters")} type="checkbox" />
            <span className="text-2xl tracking-wider text-off-white">
              Include Uppercase Letters
            </span>
            <div className="custom-checkbox-input"></div>
          </label>
        </div>

        <div>
          <label className="custom-checkbox-contain">
            <input {...register("includeLowercaseLetters")} type="checkbox" />
            <span className="text-2xl tracking-wider text-off-white">
              Include Lowercase Letters
            </span>
            <div className="custom-checkbox-input"></div>
          </label>
        </div>

        <div>
          <label className="custom-checkbox-contain">
            <input {...register("includeNumbers")} type="checkbox" />
            <span className="text-2xl tracking-wider text-off-white">
              Include Numbers
            </span>
            <div className="custom-checkbox-input"></div>
          </label>
        </div>

        <div>
          <label className="custom-checkbox-contain">
            <input {...register("includeSymbols")} type="checkbox" />
            <span className="text-2xl tracking-wider text-off-white">
              Include Symbols
            </span>
            <div className="custom-checkbox-input"></div>
          </label>
        </div>

        <div className="my-8 flex flex-row items-center justify-between bg-very-dark-blue p-8">
          <span className="text-2xl uppercase tracking-wide text-medium-gray">
            Strength
          </span>
          <PasswordStrengthIndicator strength={passwordStrength} />
        </div>

        <button
          type="submit"
          className="w-full border-2 border-light-green bg-light-green p-8 text-2xl uppercase tracking-wide text-dark-gray-blue hover:bg-dark-gray-blue hover:text-light-green"
        >
          Generate &rarr;
        </button>
      </form>
    </div>
  );
}

const PasswordStrengthIndicator = (props: { strength: number }) => {
  const { strength } = props;
  let bars = [];
  const text = passwordStrengths[strength]?.text;
  const color = passwordStrengths[strength]?.color;

  for (let i = 1; i <= strength; i++) {
    bars.push(
      <div key={i} className={`inline-block h-14 w-5 ${color} bg-b`}></div>
    );
  }

  for (let i = strength + 1; i <= 4; i++) {
    bars.push(
      <div
        key={i}
        className="inline-block h-14 w-5 border-4 border-off-white"
      ></div>
    );
  }
  return (
    <div className="flex flex-row items-center space-x-4">
      <span className="text-2xl uppercase tracking-wide text-off-white">
        {text}
      </span>
      <div className="inline-flex space-x-3">{bars}</div>
    </div>
  );
};

export default App;
