import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import "./AutoComplete.css";

// Define types for props and data
interface Item {
    id: number;
    name: string;
}

interface AutoCompleteProps {
    data: Item[];
    placeholder?: string;
    debug?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    data = [],
    placeholder = "Type your search",
    debug = false,
}) => {
    // State variables to manage component behavior
    const [query, setQuery] = useState<string>(""); // Current search query
    const [filteredData, setFilteredData] = useState<Item[]>([]); // Filtered data based on query
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // ID of the selected item
    const [activeIndex, setActiveIndex] = useState<number>(-1); // Index of the currently active suggestion in the list
    const [showItems, setShowItems] = useState<boolean>(false); // Whether to show the suggestions dropdown

    // Handles changes in the input field
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value); // Update the query state

        // Filter data based on the query
        let filteredAux: Item[] = [];
        if (value) {
            filteredAux = data.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setShowItems(true); // Show the suggestions dropdown
        } else {
            filteredAux = [];
            setShowItems(false); // Hide the dropdown if the query is empty
        }

        setFilteredData(filteredAux); // Update the filtered data
        setActiveIndex(-1); // Reset the active index when the query changes
    };

    // Handles selection of an item from the suggestions list
    const handleSelection = (item: Item) => {
        setQuery(item.name); // Update the input with the selected item's name
        setSelectedItemId(item.id); // Update the selected item ID
        setFilteredData([]); // Clear the filtered data
        setShowItems(false); // Hide the suggestions dropdown
    };

    // Highlights the matching part of an item's name
    const hightlightMatch = (item: string) => {
        const regex = new RegExp(`(${query})`, "gi");
        const parts = item.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <b key={i}>{part}</b> : part
        );
    };

    // Scrolls the active suggestion into view
    const scrollToActiveItem = (index: number) => {
        const activeItem = document.querySelector(
            `.autocomplete-list-item:nth-child(${index + 1})`
        );
        if (activeItem) {
            activeItem.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    };

    // Handles keyboard navigation within the suggestions list
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            // Move the active index down, wrapping around if necessary
            setActiveIndex((prevIndex) =>
                prevIndex < filteredData.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (event.key === "ArrowUp") {
            // Move the active index up, staying within bounds
            setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        } else if (event.key === "Enter" && activeIndex >= 0) {
            // Select the active item if Enter is pressed
            handleSelection(filteredData[activeIndex]);
        }
    };

    // Scrolls to the active item whenever the activeIndex changes
    useEffect(() => {
        if (activeIndex >= 0) {
            scrollToActiveItem(activeIndex);
        }
    }, [activeIndex]);

    // Renders the suggestions list
    const displayItems = () => {
        return (
            <ul className="autocomplete-list">
                {filteredData.map((item, index) => (
                    <li
                        className={`autocomplete-list-item ${
                            index === activeIndex ? "active" : ""
                        }`}
                        key={item.id}
                        onClick={() => handleSelection(item)}
                    >
                        {hightlightMatch(item.name)}
                    </li>
                ))}
            </ul>
        );
    };

    // Clears the input field and resets related states
    const clearInput = () => {
        setQuery("");
        setFilteredData([]);
        setShowItems(false);
        setActiveIndex(-1);
    };

    // Logs debug information to the console (no visual output)
    const showDebug = () => {
        console.info("Debug", {
            query: query,
            selectedItemId,
            filteredData,
        });
        return "";
    };

    return (
        <div className="autocomplete-container">
            <div className="autocomplete-input-wrapper">
                <input
                    type="text"
                    className="autocomplete-input"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
                {query && (
                    <span className="clear-icon" onClick={clearInput}>
                        &times;
                    </span>
                )}
            </div>
            {showItems && displayItems()}{" "}
            {/* Conditionally render suggestions */}
            {debug && showDebug()} {/* Conditionally log debug info */}
        </div>
    );
};

export default AutoComplete;
