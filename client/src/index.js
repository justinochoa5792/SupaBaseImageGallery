import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://fllsdamdpttceokiezkf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsbHNkYW1kcHR0Y2Vva2llemtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU1MzAwMDYsImV4cCI6MTk5MTEwNjAwNn0.QmPzWkXNdEUozffDw47qpGoMZh_Mown7F3YmYtx983U"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
