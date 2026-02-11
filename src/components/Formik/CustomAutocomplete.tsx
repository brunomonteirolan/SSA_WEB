import React, { useMemo, useState } from "react";
import { useField } from "formik";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";

interface Item {
  value: string;
  label: string;
}

interface CustomAutocompleteProps {
  name: string;
  label: string;
  placeholder?: string;
  items: Item[];
  isLoading?: boolean;
}

function normalizeSelected(value: unknown): Item[] {
  if (Array.isArray(value)) return value as Item[];
  if (value && typeof value === "object") return [value as Item];
  return [];
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  name,
  items,
  isLoading,
  label,
  placeholder,
}) => {
  const [field, meta, helpers] = useField(name);

  const selectedItems = useMemo(() => normalizeSelected(meta.value), [meta.value]);
  const selectedLabel = selectedItems[0]?.label ?? "";

  const [query, setQuery] = useState<string>(selectedLabel);
  const [open, setOpen] = useState<boolean>(false);

  const errorText = meta.error && meta.touched ? String(meta.error) : "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 20);
    return items
      .filter((it) => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q))
      .slice(0, 20);
  }, [items, query]);

  const handleSelect = (it: Item) => {
    // mantém o formato "selectedItems" que você usava (array)
    helpers.setValue([it]);
    setQuery(it.label);
    setOpen(false);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    setOpen(true);

    // se o usuário apagar o texto, limpa o valor
    if (!v) helpers.setValue([]);
  };

  return (
    <Box position="relative">
      <FormControl isInvalid={!!errorText}>
        <FormLabel m={0}>{label}</FormLabel>

        <Box position="relative">
          <Input
            name={field.name}
            value={query}
            placeholder={isLoading ? "Loading values..." : placeholder}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // dá tempo do clique no item acontecer antes de fechar
              setTimeout(() => setOpen(false), 120);
            }}
            autoComplete="off"
          />

          {isLoading ? (
            <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)">
              <Spinner size="sm" />
            </Box>
          ) : null}
        </Box>

        {open && !isLoading && filtered.length > 0 ? (
          <List
            mt={2}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            bg="gray.600"
            maxH="240px"
            overflowY="auto"
            zIndex={10}
            position="absolute"
            width="100%"
          >
            {filtered.map((it) => (
              <ListItem
                key={it.value}
                px={3}
                py={2}
                bg="gray.600"
                _hover={{ bg: "gray.500", cursor: "pointer" }}
                onMouseDown={(e) => e.preventDefault()} // evita blur antes do click
                onClick={() => handleSelect(it)}
              >
                {it.label}
              </ListItem>
            ))}
          </List>
        ) : null}

        {errorText.length ? (
          <Text mt={2} color="red.500">
            {errorText}
          </Text>
        ) : null}
      </FormControl>
    </Box>
  );
};

export default CustomAutocomplete;
