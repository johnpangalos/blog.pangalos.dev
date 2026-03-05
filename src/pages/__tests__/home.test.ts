import { render } from "vitest-browser-astro";
import { describe, it, expect } from "vitest";
import HomePageWrapper from "./HomePageWrapper.astro";

const mockPosts = [
  {
    title: "the.winds.of.2025",
    date: "January 19, 2025",
    description: "A test description for winds",
    slug: "the-winds-of-2025",
  },
  {
    title: "the.remaking.of",
    date: "July 8, 2022",
    description: "A test description for remaking",
    slug: "the-remaking-of",
  },
];

describe("Home Page", () => {
  it("renders with posts", async () => {
    const screen = await render(HomePageWrapper, {
      props: { posts: mockPosts },
    });
    const page = screen.getByTestId("home-page");
    await expect(page).toMatchScreenshot("home-with-posts");
  });

  it("renders empty state", async () => {
    const screen = await render(HomePageWrapper, {
      props: { posts: [] },
    });
    const page = screen.getByTestId("home-page");
    await expect(page).toMatchScreenshot("home-empty");
  });
});
