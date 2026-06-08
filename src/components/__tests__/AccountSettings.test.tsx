import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountSettings } from "../AccountSettings";

HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

const defaultUser = {
  name: "Test User",
  email: "test@example.com",
  age: 25,
  weight: 80,
  height: 180,
};

describe("AccountSettings", () => {
  it("renders the dialog title", () => {
    render(
      <AccountSettings
        user={defaultUser}
        open={true}
        onOpenChange={() => {}}
      />
    );
    expect(screen.getByText("Account Settings")).toBeDefined();
  });

  it("renders the profile tab with pre-filled user data", () => {
    render(
      <AccountSettings
        user={defaultUser}
        open={true}
        onOpenChange={() => {}}
      />
    );
    const ageInput = screen.getByLabelText("Age") as HTMLInputElement;
    const weightInput = screen.getByLabelText("Weight") as HTMLInputElement;
    expect(ageInput.value).toBe("25");
    expect(weightInput.value).toBe("80");
  });

  it("switches to account tab when clicked", async () => {
    const user = userEvent.setup();
    render(
      <AccountSettings
        user={defaultUser}
        open={true}
        onOpenChange={() => {}}
      />
    );
    const accountTab = screen.getByRole("tab", { name: "Account & Security" });
    await user.click(accountTab);
    expect(screen.getByText("Change Email")).toBeDefined();
  });

  it("shows danger zone with delete button", async () => {
    const user = userEvent.setup();
    render(
      <AccountSettings
        user={defaultUser}
        open={true}
        onOpenChange={() => {}}
      />
    );
    await user.click(screen.getByRole("tab", { name: "Account & Security" }));
    expect(screen.getByText("Danger Zone")).toBeDefined();
    expect(screen.getByText("Delete Account")).toBeDefined();
  });

  it("shows confirmation after clicking delete", async () => {
    const user = userEvent.setup();
    render(
      <AccountSettings
        user={defaultUser}
        open={true}
        onOpenChange={() => {}}
      />
    );
    await user.click(screen.getByRole("tab", { name: "Account & Security" }));
    await user.click(screen.getByText("Delete Account"));
    expect(screen.getByText("Are you sure?")).toBeDefined();
  });

  it("cancel button hides confirmation", async () => {
    const user = userEvent.setup();
    render(
      <AccountSettings
        user={defaultUser}
        open={true}
        onOpenChange={() => {}}
      />
    );
    await user.click(screen.getByRole("tab", { name: "Account & Security" }));
    await user.click(screen.getByText("Delete Account"));
    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Are you sure?")).toBeNull();
  });

  it("renders nothing useful when user has no data", () => {
    render(
      <AccountSettings
        user={{}}
        open={true}
        onOpenChange={() => {}}
      />
    );
    const ageInput = screen.getByLabelText("Age") as HTMLInputElement;
    expect(ageInput.value).toBe("");
  });
});
