"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Facebook, Instagram, Plus, X } from "lucide-react"

import {
  Card,
  CardContent,
} from "@/registry/new-york/ui/card"
import { Button } from "@/registry/new-york/ui/button"
import { ButtonGroup } from "@/registry/new-york/ui/button-group"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import { Separator } from "@/registry/new-york/ui/separator"

const MAX_PUBLICATIONS = 5

export function InstagramGiveawayForm() {
  const [entries, setEntries] = React.useState<string[]>([""])

  const addEntry = () => {
    if (entries.length >= MAX_PUBLICATIONS) return
    setEntries((prev) => [...prev, ""])
  }

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, value: string) => {
    setEntries((prev) => prev.map((v, i) => (i === index ? value : v)))
  }

  const canAddMore = entries.length < MAX_PUBLICATIONS

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          Faça seu sorteio no Instagram agora mesmo!
        </h1>
        <p className="text-base text-muted-foreground">
          Cole o @usuário ou a URL de uma publicação. Você pode adicionar mais
          de uma.
        </p>
      </div>
      <Card className="gap-6 py-8 shadow-lg">
        <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {entries.map((value, i) => {
            const isLast = i === entries.length - 1
            return (
              <div key={i} className="grid gap-2">
                <Label
                  htmlFor={`instagram-entry-${i}`}
                  className="text-sm font-medium"
                >
                  {entries.length === 1
                    ? "@usuário ou url do instagram"
                    : `Publicação ${i + 1}`}
                </Label>
                <div className="relative">
                  <Instagram
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 z-10 size-5 -translate-y-1/2 text-muted-foreground"
                  />
                  <ButtonGroup className="w-full">
                    <Input
                      id={`instagram-entry-${i}`}
                      name={`instagram-entry-${i}`}
                      placeholder="alok"
                      autoComplete="off"
                      value={value}
                      onChange={(e) => updateEntry(i, e.target.value)}
                      className="h-12 pl-11 text-base"
                    />
                    {entries.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12"
                        onClick={() => removeEntry(i)}
                        aria-label={`Remover publicação ${i + 1}`}
                      >
                        <X />
                      </Button>
                    )}
                    {isLast && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12"
                        onClick={addEntry}
                        disabled={!canAddMore}
                        aria-label="Adicionar publicação"
                      >
                        <Plus />
                      </Button>
                    )}
                  </ButtonGroup>
                </div>
              </div>
            )
          })}
        </div>

        <Button
          asChild
          size="lg"
          className="h-12 rounded-xl bg-blue-600 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-600/40"
        >
          <Link href="/instagram/select-post">
            Continuar <ArrowRight className="size-5" />
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            ou
          </span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 rounded-xl text-base font-medium"
        >
          <Facebook className="size-5" />
          Continuar com o Facebook
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 rounded-xl text-base font-medium"
        >
          <Instagram className="size-5" />
          Continuar com o Instagram
        </Button>
        </CardContent>
      </Card>
    </div>
  )
}
