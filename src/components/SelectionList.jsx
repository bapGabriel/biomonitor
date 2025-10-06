function SelectionList({ items, selectedItem, setSelectedItem, getItemLabel }) {
  return (
    <ul className="max-h-48 overflow-y-auto">
      {items.map((item) => {
        const label = getItemLabel(item);
        return (
          <li
            key={item._frontId}
            onClick={() => setSelectedItem(item)}
            className={`cursor-pointer px-4 py-2 rounded mb-1 transition-colors
              ${selectedItem?._frontId === item._frontId ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
          >
            {label}
          </li>
        );
      })}
    </ul>
  );
}

export default SelectionList;
