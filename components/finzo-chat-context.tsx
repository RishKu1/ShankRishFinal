import { createContext } from "react";

const FinzoChatContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: { top: number; left: number };
  setPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
} | null>(null);

export default FinzoChatContext; 