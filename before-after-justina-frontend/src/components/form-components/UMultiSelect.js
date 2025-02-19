"use client";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multiple-selector";

// Dummy data for data structure example
const OPTIONS = [
  { label: "nextjs", value: "Nextjs" },
  { label: "React", value: "react" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Ember", value: "ember", disable: true },
  { label: "Gatsby", value: "gatsby", disable: true },
  { label: "Astro", value: "astro" },
];

/**
 * Note: Below @param data is an array of objects containing label and value
 */
const UMultiSelect = ({ name, label, placeholder, data, disabled }) => {
  const { control } = useFormContext() ?? {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelector
            onValuesChange={field.onChange}
            values={field.value || []}
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput
                placeholder={placeholder}
                disabled={disabled}
              />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {data?.map((item) => (
                  <MultiSelectorItem
                    key={item?.value}
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </FormItem>
      )}
    />
  );
};
export default UMultiSelect;
