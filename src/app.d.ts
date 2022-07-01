/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces

type Theme = "light" | "dark" | null;
type User = {
  name: string;
  email: string;
  avatar: string;
};

declare namespace App {
  interface Locals {
    user?: User;
  }

  // interface Platform {}

  interface Session {
    theme: Theme;
  }

  // interface Stuff {}
}
