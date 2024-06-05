// src/UserList.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  List,
  ListItem,
  Text,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory")) || []
  );
  const [isSorted, setIsSorted] = useState(false);
  const [originalUsers, setOriginalUsers] = useState([]);

  // Fetch user data from the API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setOriginalUsers(data);
      });
  }, []);

  // Update local storage with search history whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Function to handle search
  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);

    if (searchTerm && !searchHistory.includes(searchTerm)) {
      setSearchHistory([searchTerm, ...searchHistory]);
    } else {
      // Move the search term to the top if it already exists
      setSearchHistory([
        searchTerm,
        ...searchHistory.filter((term) => term !== searchTerm),
      ]);
    }
  };

  // Function to handle input change in search box
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Function to clear search term and reset filtered users to original list
  const handleClear = () => {
    setSearchTerm("");
    setFilteredUsers(users);
  };

  // Function to toggle sorting of users by name
  const handleSortToggle = () => {
    if (isSorted) {
      setFilteredUsers(originalUsers);
    } else {
      const sorted = [...filteredUsers].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setFilteredUsers(sorted);
    }
    setIsSorted(!isSorted);
  };

  return (
    <Box p={5}>
      <Flex mb={4} alignItems="center">
        <InputGroup mr={2}>
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search by name"
            list="search-suggestions"
          />
          <datalist id="search-suggestions">
            {searchHistory.map((term, index) => (
              <option key={index} value={term} />
            ))}
          </datalist>
          <InputRightElement width="4.5rem">
            {searchTerm && (
              <IconButton
                aria-label="Clear search"
                icon={<CloseIcon />}
                size="sm"
                onClick={handleClear}
                variant="ghost"
                colorScheme="red"
              />
            )}
          </InputRightElement>
        </InputGroup>
        <Button onClick={handleSearch} colorScheme="teal" mr={2}>
          Search
        </Button>
        <Button onClick={handleSortToggle} colorScheme="teal" width="80px">
          {isSorted ? "Reset" : "Sort"}
        </Button>
      </Flex>
      <List spacing={3} mb={4}>
        {filteredUsers.map((user) => (
          <ListItem
            key={user.id}
            border="1px solid #ddd"
            p={3}
            borderRadius="md"
          >
            <Text fontSize="25px" fontWeight="bold">
              {user.name}
            </Text>
            <Text fontSize="md" mt={3}>
              <strong>Username:</strong> {user.username}
            </Text>
            <Text fontSize="md">
              <strong>Email:</strong> {user.email}
            </Text>
            <Text fontSize="md">
              <strong>Address:</strong> {user.address.street},{" "}
              {user.address.suite}, {user.address.city}, {user.address.zipcode}
            </Text>
            <Text fontSize="md">
              <strong>Phone:</strong> {user.phone}
            </Text>
            <Text fontSize="md">
              <strong>Website:</strong> {user.website}
            </Text>
            <Text fontSize="md" mt={1}>
              <strong>Company:</strong> {user.company.name}
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;
