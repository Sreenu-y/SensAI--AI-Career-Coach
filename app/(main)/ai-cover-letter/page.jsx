import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import CoverLetterList from "./_components/cover-letter-list";
import { getCoverLetters } from "@/actions/cover-letter";

const AICoverLetterPage = async () => {
  const coverLetters = await getCoverLetters();
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button>
            <Plus className="size-4" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
};

export default AICoverLetterPage;
