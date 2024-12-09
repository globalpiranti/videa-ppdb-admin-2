import { ReactNode, useState } from "react";
import User from "../api/models/user";
import { UserContext } from "../hooks/user";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
