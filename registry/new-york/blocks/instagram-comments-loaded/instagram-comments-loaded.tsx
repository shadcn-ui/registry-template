"use client"

import * as React from "react"
import { Settings } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import { Label } from "@/registry/new-york/ui/label"
import { Progress } from "@/registry/new-york/ui/progress"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { Separator } from "@/registry/new-york/ui/separator"
import { Switch } from "@/registry/new-york/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

const comments = [
  { user: "annac.vidal", text: "😍😍😍" },
  { user: "silma2364", text: "Olha suas DM por favor 🙏🙏🙏" },
  { user: "mallorybowen718", text: "Great setup! 🍀" },
  {
    user: "pedro_henriquede_aquino_bispo",
    text: "Oi Alok! Tudo bem? Sou muito seu fã 🙌🔥 Queria muito ganhar",
  },
  { user: "brendabarret", text: "Goalsssss❤️🙌🙌🙌👏" },
  { user: "sennamu", text: "Herança de Deus 🙏" },
  { user: "silma2364", text: "Lindossss😍😍😍❤️❤️❤️👏👏👏" },
]

const accounts = [
  { user: "alok", initials: "A" },
  { user: "djmariana", initials: "DM" },
  { user: "festivalvibes", initials: "FV" },
]

const TOTAL_COMMENTS = 332

export function InstagramCommentsLoaded() {
  const [testMode, setTestMode] = React.useState(false)

  return (
    <Card className="w-full max-w-xl gap-6 py-8 shadow-lg">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Passo 3 de 3</span>
            <span>Sortear</span>
          </div>
          <Progress value={100} />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <CardTitle className="text-xl tracking-tight">
            Comentários carregados
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {TOTAL_COMMENTS.toLocaleString("pt-BR")}
            </span>{" "}
            comentários prontos para o sorteio
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Card className="gap-0 overflow-hidden p-0 shadow-none">
          <div className="flex items-center justify-between gap-3 p-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                  >
                    <div className="flex -space-x-2">
                      {accounts.map((a) => (
                        <Avatar
                          key={a.user}
                          className="size-9 ring-2 ring-background"
                        >
                          <AvatarFallback className="text-xs">
                            {a.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="flex min-w-0 flex-col items-start">
                      <span className="truncate text-sm font-medium">
                        {accounts.length === 1
                          ? `@${accounts[0].user}`
                          : `@${accounts[0].user} +${accounts.length - 1}`}
                      </span>
                      {accounts.length > 1 && (
                        <span className="truncate text-xs text-muted-foreground">
                          {accounts.length} publicações
                        </span>
                      )}
                    </div>
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
            <Button variant="ghost" size="icon" aria-label="Configurações">
              <Settings className="size-4" />
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-64">
            <ul className="flex flex-col gap-2 p-4 text-sm">
              {comments.map((c, i) => (
                <li key={`${c.user}-${i}`} className="leading-relaxed">
                  <span className="font-semibold">@{c.user}:</span>{" "}
                  <span className="text-foreground/90">{c.text}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <Label
              htmlFor="test-mode"
              className="flex cursor-pointer flex-col gap-0.5"
            >
              <span className="text-sm font-medium">Modo teste</span>
              <span className="text-xs text-muted-foreground">
                Simula o sorteio sem definir um ganhador
              </span>
            </Label>
            <Switch
              id="test-mode"
              checked={testMode}
              onCheckedChange={setTestMode}
            />
          </div>

          <Button
            type="button"
            size="lg"
            className="h-12 rounded-xl bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-600/40"
          >
            {testMode ? "Testar sorteio" : "Sortear um ganhador"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
