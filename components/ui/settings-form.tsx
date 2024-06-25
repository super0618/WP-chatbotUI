import { FC, useContext, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { IconSettings, IconChevronDown } from "@tabler/icons-react"
import { ChatbotUIContext } from "@/context/context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "./dropdown-menu"
import i18Config from "@/next-i18next.config"
import { useParams, useRouter } from "next/navigation"

interface OptionItemProps {
  label: string
  dir: string
  onClick: () => void
}

const OptionItem = ({ label, dir, onClick }: OptionItemProps) => {
  return (
    <div
      className="hover:bg-accent cursor-pointer truncate rounded p-2 hover:opacity-50"
      onClick={onClick}
      dir={dir}
    >
      {label}
    </div>
  )
}

export const SettingsForm: FC = () => {
  const { dir, setDir } = useContext(ChatbotUIContext)

  const params = useParams()
  const Router = useRouter()
  const inputRef = useRef<HTMLButtonElement>(null)

  const { setTheme, theme } = useTheme()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false)
  const [isLocaleOpen, setIsLocaleOpen] = useState<boolean>(false)
  const [isDirOpen, setIsDirOpen] = useState<boolean>(false)

  const [selectedLocale, setSelectedLocale] = useState<string>(
    (params.locale as string)
      ? (params.locale as string)
      : i18Config.i18n.defaultLocale
  )
  const [selectedTheme, setSelectedTheme] = useState(theme)
  const [selectedDir, setSelectedDir] = useState(dir)
  const locales = i18Config.i18n.locales

  const onSelectLocale: (locale: string) => void = (locale: string) => {
    setSelectedLocale(locale)
    localStorage.setItem("locale", locale)
    if(locale === "ar" || locale === "he") {
      setSelectedDir("rtl")
      localStorage.setItem("dir", "rtl")
    } else {
      setSelectedDir("ltr")
      localStorage.setItem("dir", "ltr")
    }
    setIsLocaleOpen(false)
  }

  const onSelectTheme: (theme: string) => void = (theme: string) => {
    setSelectedTheme(theme)
    localStorage.setItem("theme", theme)
    setIsThemeOpen(false)
  }

  const onSelectDir: (dir: string) => void = (dir: string) => {
    setSelectedDir(dir)
    localStorage.setItem("dir", dir)
    setIsDirOpen(false)
  }

  const onSave: () => void = () => {
    if (selectedTheme) {
      setTheme(selectedTheme as string)
    }
    if (selectedDir) {
      setDir(selectedDir)
    }
    setIsOpen(prevState => !prevState)
    if (selectedLocale) {
      if(selectedLocale === "en") {
        return Router.push('/chat');
      }
      return Router.push(`/chat/${selectedLocale}`)
    }
  }

  const onCancel: () => void = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconSettings className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent dir={dir}>
        <DialogHeader>
          <DialogTitle className={dir === "rtl" ? "text-right" : "text-left"}>
            Settings
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="mb-2">Language</div>
          <DropdownMenu open={isLocaleOpen} onOpenChange={setIsLocaleOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                ref={inputRef}
                className="mb-4 flex w-full items-center justify-between"
                variant="outline"
              >
                <div className="flex items-center">
                  {selectedLocale
                    ? selectedLocale.toUpperCase()
                    : "Select a language"}
                </div>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              style={{ width: inputRef.current?.offsetWidth }}
            >
              <div className="max-h-[300px] overflow-auto">
                {locales.map((locale: string) => (
                  <OptionItem
                    key={locale}
                    label={locale.toUpperCase()}
                    dir={dir}
                    onClick={() => onSelectLocale(locale)}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mb-2">Theme</div>
          <DropdownMenu open={isThemeOpen} onOpenChange={setIsThemeOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className="mb-4 flex w-full items-center justify-between"
                variant="outline"
              >
                <div className="flex items-center">
                  {selectedTheme
                    ? selectedTheme[0].toUpperCase() +
                      selectedTheme.substring(1)
                    : "Select a theme"}
                </div>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              style={{ width: inputRef.current?.offsetWidth }}
            >
              <div className="max-h-[300px] overflow-auto">
                <OptionItem
                  label="Light"
                  onClick={() => onSelectTheme("light")}
                  dir={dir}
                />
                <OptionItem
                  label="Dark"
                  onClick={() => onSelectTheme("dark")}
                  dir={dir}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mb-2">Direction</div>
          <DropdownMenu open={isDirOpen} onOpenChange={setIsDirOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className="mb-4 flex w-full items-center justify-between"
                variant="outline"
              >
                <div className="flex items-center">
                  {selectedDir
                    ? selectedDir.toUpperCase()
                    : "Select a direction"}
                </div>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              style={{ width: inputRef.current?.offsetWidth }}
            >
              <div className="max-h-[300px] overflow-auto">
                <OptionItem
                  label="LTR"
                  onClick={() => onSelectDir("ltr")}
                  dir={dir}
                />
                <OptionItem
                  label="RTL"
                  onClick={() => onSelectDir("rtl")}
                  dir={dir}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onSave}>Save</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
