import { useEffect, useState } from "react";
import AutoComplete from "./components/AutoComplete";
import "./App.css";

interface User {
    id: number;
    name: string;
}

function App() {
    const URL = "https://jsonplaceholder.typicode.com/users";
    const [data, setData] = useState<User[]>([]);
    const [debug, setDebug] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);

                if (!response.ok) {
                    throw new Error(
                        "An error occurred fetching the data. Please check the configuration."
                    );
                }

                const data: User[] = await response.json();

                setData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="content">
            <h1>AutoComplete Component</h1>
            <p>
                This is <b>React Autocomplete</b> component to search and select
                from a list of options.
                <br />
                <button
                    className={`debug ${
                        debug ? "debug-enabled" : "debug-disabled"
                    }`}
                    onClick={() => setDebug(!debug)}
                >
                    Enable Debug Logs
                </button>
            </p>
            <AutoComplete
                data={data}
                placeholder="Type your search"
                debug={debug}
            />
        </div>
    );
}

export default App;
