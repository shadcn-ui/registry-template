"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check, Play, Search } from "lucide-react"

import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio"
import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import { ButtonGroup } from "@/registry/new-york/ui/button-group"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import { Input } from "@/registry/new-york/ui/input"
import { Progress } from "@/registry/new-york/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

const TOTAL_STEPS = 3
const CURRENT_STEP = 2

const accounts = [
  { user: "alok", initials: "A" },
  { user: "djmariana", initials: "DM" },
  { user: "festivalvibes", initials: "FV" },
]

const posts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  hue: (i * 47) % 360,
  account: accounts[i % accounts.length],
  comments: 80 + ((i * 137) % 420),
}))

export function InstagramSelectPost() {
  const [selected, setSelected] = React.useState<number[]>([])

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const totalComments = posts
    .filter((p) => selected.includes(p.id))
    .reduce((sum, p) => sum + p.comments, 0)

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 justify-center p-4 pb-24 sm:items-center">
        <Card className="w-full max-w-xl gap-6 py-8 shadow-lg">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Passo {CURRENT_STEP} de {TOTAL_STEPS}
            </span>
            <span>Selecionar publicação</span>
          </div>
          <Progress value={(CURRENT_STEP / TOTAL_STEPS) * 100} />
        </div>

        <CardTitle className="text-2xl leading-tight tracking-tight">
          Selecione as publicações do seu sorteio
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <ButtonGroup className="w-full">
            <Input
              type="search"
              inputMode="url"
              placeholder="Cole a URL do post"
              className="h-11 text-base"
            />
            <Button
              type="submit"
              variant="outline"
              className="h-11"
              aria-label="Buscar"
            >
              <Search />
            </Button>
          </ButtonGroup>
        </form>

        <div className="flex items-center justify-between gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                >
                  <div className="flex -space-x-2">
                    {accounts.map((a) => (
                      <Avatar
                        key={a.user}
                        className="size-7 ring-2 ring-background"
                      >
                        <AvatarFallback className="text-[10px]">
                          {a.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {accounts.length === 1
                      ? `@${accounts[0].user}`
                      : `@${accounts[0].user} +${accounts.length - 1}`}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <ul className="flex flex-col gap-0.5">
                  {accounts.map((a) => (
                    <li key={a.user}>@{a.user}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Galeria
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {posts.map((post) => {
            const isSelected = selected.includes(post.id)
            return (
              <button
                key={post.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Publicação ${post.id} de @${post.account.user}`}
                onClick={() => toggle(post.id)}
                className="group relative rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-2"
              >
                <AspectRatio
                  ratio={1}
                  style={{
                    background: `linear-gradient(135deg, hsl(${post.hue} 70% 55%), hsl(${(post.hue + 60) % 360} 70% 40%))`,
                  }}
                  className="relative overflow-hidden rounded-lg transition group-hover:shadow-md"
                >
                  <Play
                    aria-hidden="true"
                    className="absolute right-2 top-2 size-4 fill-white text-white drop-shadow"
                  />
                  {isSelected && (
                    <span className="absolute inset-0 rounded-lg ring-2 ring-blue-600 ring-offset-2 ring-offset-background bg-blue-600/15" />
                  )}
                  <span
                    aria-hidden="true"
                    className={`absolute left-2 top-2 flex size-5 items-center justify-center rounded-full border-2 transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-white/80 bg-black/20"
                    }`}
                  >
                    {isSelected && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4">
                    <Avatar className="size-5 ring-1 ring-white/50">
                      <AvatarFallback className="text-[9px]">
                        {post.account.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-[11px] font-medium text-white drop-shadow">
                      @{post.account.user}
                    </span>
                  </span>
                </AspectRatio>
              </button>
            )
          })}
        </div>

        </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">
              {selected.length === 0
                ? "Nenhuma publicação selecionada"
                : `${selected.length} ${selected.length === 1 ? "publicação selecionada" : "publicações selecionadas"}`}
            </span>
            {selected.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ~{totalComments.toLocaleString("pt-BR")} comentários no total
              </span>
            )}
          </div>
          <Button
            asChild={selected.length > 0}
            type="button"
            size="lg"
            disabled={selected.length === 0}
            className="h-11 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-600/40"
          >
            {selected.length > 0 ? (
              <Link href="/instagram/comments-loaded">
                Continuar <ArrowRight className="size-5" />
              </Link>
            ) : (
              <>
                Continuar <ArrowRight className="size-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
