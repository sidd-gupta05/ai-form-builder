import { Button, buttonVariants } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { db } from "../../../configs";
import { JsonForms } from "../../../configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import {
  LibraryBig,
  LineChart,
  MessageSquare,
  Shield,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
} from "../../../components/ui/dialog";
import { Loader2 } from "lucide-react";

const SideNav = () => {
  const menuList = [
    { id: 1, name: "My Forms", icon: LibraryBig, path: "/dashboard" },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquare,
      path: "/dashboard/responses",
    },
    // { id: 3, name: 'Analytics', icon: LineChart, path: '/dashboard/analytics' },
    { id: 4, name: "Upgrade", icon: Shield, path: "/dashboard/upgrade" },
  ];

  const { user } = useUser();
  const path = usePathname();
  const [formList, setFormList] = useState([]);
  const [PercFileCreated, setPercFileCreated] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (user) {
      GetFormList();
    }
  }, [user]);

  const GetFormList = async () => {
    if (!db) {
      console.error("Database connection (db) is undefined!");
      return;
    }

    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(JsonForms.id));

    setFormList(result);

    const perc = (result.length / 3) * 100;
    setPercFileCreated(perc);
  };

  const onCreateForm = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await GetFormList();
    setLoading(false);
    setOpenDialog(false);
  };

  return (
    <div>
      <div className="md:hidden fixed mt-0.5 right-0 flex justify-end z-50 bg-white p-2 rounded-full shadow-md">
        <button onClick={() => setOpenMenu(!openMenu)} className="p-2">
          <MoreVertical className="h-6 w-6" />
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md p-4 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 md:relative md:h-screen md:flex md:flex-col overflow-y-auto`}
      >
        <div className="md:hidden flex justify-end">
          <button onClick={() => setOpenMenu(false)} className="p-2">
            ✖
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          {menuList.map((menu, index) => (
            <Link
              href={menu.path}
              key={index}
              className={`flex items-center gap-3 p-4 rounded-lg text-gray-500 transition-all 
                            hover:bg-primary hover:text-white ${
                              path == menu.path && "bg-primary text-white"
                            }`}
            >
              <menu.icon className="h-5 w-5" />
              <span className="block md:block">{menu.name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-48 p-4 min-h-screen bg-white">
          <Button className="w-full" onClick={() => setOpenDialog(true)}>
            + Create Form
          </Button>
          <div className="my-5">
            <Progress value={PercFileCreated} />
            <h2 className="text-sm mt-2 text-gray-600">
              <strong>{formList?.length} </strong>Out of <strong>3</strong>{" "}
              Files Created
            </h2>
            <h2 className="text-sm mt-3 text-gray-600">
              Upgrade your plan for unlimited AI form builds
            </h2>
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                className="my-2"
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your form (e.g., 'A contact form with name, email, and message fields')"
                value={userInput}
              />
              <div className="flex gap-2 my-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onCreateForm}
                  disabled={loading || !userInput.trim()}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SideNav;
