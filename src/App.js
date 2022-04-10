import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [options, setOptions] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length === 0) {
        console.log("State reset");
        setOptions([]);
      } else {
        search(keyword);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const search = async (keyword) => {
    console.log(`Searching...`);
    axios
      .get(`https://api-test-mongo.herokuapp.com/?keyword=${keyword}`)
      .then((response) => {
        setOptions(response.data.result);
        console.log(response.data.result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Autocomplete
      disablePortal
      freeSolo
      fullWidth
      options={options}
      getOptionLabel={(option) => option.title}
      onInput={(e) => setKeyword(e.target.value)}
      onChange={(e, obj) => console.log(obj)}
      renderInput={(params) => <TextField {...params} label="Movie" />}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.title, inputValue);
        const parts = parse(option.title, matches);
        return (
          <li {...props}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    background: part.highlight ? "yellow" : "none",
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
    />
  );
}
