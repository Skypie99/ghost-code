// =======================================================
//  PAC-MAN CODE TRAINER — Card Deck
// -------------------------------------------------------
//  Add a new flashcard by copying any block below,
//  changing the words, and saving. Refresh the game tab.
//
//  Fields:
//    id        : unique short string (no spaces)
//    category  : "claude"  -> Claude Code command
//                "mac"     -> Mac terminal command
//    prompt    : the question shown above Pac-Man
//    answer    : the CORRECT command (must match one dot)
//    decoys    : 3 wrong-but-plausible commands (never a real
//                alias of the answer — that would mark a right
//                answer wrong)
//    hint      : short memory aid (shown after wrong answer)
//    difficulty: (optional) "easy" | "medium" | "hard" — shown as a
//                colored badge by the prompt. Missing/unknown = "medium".
//    explain   : (optional) one or two sentences on WHY — the deeper
//                reasoning, shown in Learn Mode's answer-reveal panel.
//                Cards without it simply render no explanation.
// =======================================================

window.CARDS = [
  // ---------------- CLAUDE CODE (20) ----------------
  { id: "cc-help",     category: "claude", difficulty: "easy", prompt: "Open the in-app help menu in Claude Code",
    answer: "/help",       decoys: ["/?", "/menu", "/commands"],
    hint: "Slash + the obvious word." },

  { id: "cc-clear",    category: "claude", difficulty: "easy", prompt: "Clear the current Claude Code conversation",
    answer: "/clear",      decoys: ["/reset", "/new", "/wipe"],
    hint: "Same word you'd use to wipe a screen.",
    explain: "/clear wipes the conversation so Claude starts fresh. /compact keeps a summary instead — reach for clear when you switch tasks entirely." },

  { id: "cc-memory",   category: "claude", difficulty: "medium", prompt: "Open and edit Claude's long-term memory files",
    answer: "/memory",     decoys: ["/remember", "/notes", "/brain"],
    hint: "Memory = the literal name." },

  { id: "cc-init",     category: "claude", difficulty: "medium", prompt: "Create a CLAUDE.md file documenting this codebase",
    answer: "/init",       decoys: ["/setup", "/start", "/scaffold"],
    hint: "Same word `git` uses to start a repo.",
    explain: "/init scans your repo and writes a CLAUDE.md so Claude remembers how the project works — like `git init` bootstrapping a repo." },

  { id: "cc-config",   category: "claude", difficulty: "easy", prompt: "Open Claude Code's settings UI",
    answer: "/config",     decoys: ["/settings", "/prefs", "/options"],
    hint: "Short for configuration." },

  { id: "cc-model",    category: "claude", difficulty: "easy", prompt: "Switch which Claude model you're chatting with",
    answer: "/model",      decoys: ["/switch", "/brain", "/version"],
    hint: "Says exactly what it changes." },

  { id: "cc-status",   category: "claude", difficulty: "medium", prompt: "Show current session status (account, model, version)",
    answer: "/status",     decoys: ["/info", "/whoami", "/about"],
    hint: "What a dashboard reports: how things are right now.",
    explain: "/status reports account, model, and version. The decoys aren't Claude commands — `whoami` is a shell command, not a slash command." },

  { id: "cc-cost",     category: "claude", difficulty: "medium", prompt: "See how much this session has cost in tokens / $",
    answer: "/cost",       decoys: ["/usage", "/tokens", "/bill"],
    hint: "One word, four letters, $$$.",
    explain: "/cost shows the tokens and dollars spent this session — worth checking before and after a long task." },

  { id: "cc-compact",  category: "claude", difficulty: "hard", prompt: "Summarize and shrink the conversation to free up context",
    answer: "/compact",    decoys: ["/summarize", "/shrink", "/trim"],
    hint: "Like compacting a trash bag.",
    explain: "/compact summarizes older turns so they cost fewer tokens — you keep the thread but free up context. /clear would discard it." },

  { id: "cc-login",    category: "claude", difficulty: "easy", prompt: "Sign in to your Anthropic account from the CLI",
    answer: "/login",      decoys: ["/auth", "/signin", "/connect"],
    hint: "Same as every other app you've used." },

  { id: "cc-logout",   category: "claude", difficulty: "easy", prompt: "Sign out of your Anthropic account",
    answer: "/logout",     decoys: ["/exit", "/signoff", "/disconnect"],
    hint: "Opposite of login." },

  { id: "cc-review",   category: "claude", difficulty: "medium", prompt: "Ask Claude to review the current PR / changes",
    answer: "/review",     decoys: ["/check", "/audit", "/inspect"],
    hint: "What a teacher does to your homework." },

  { id: "cc-agents",   category: "claude", difficulty: "medium", prompt: "Open the sub-agents manager",
    answer: "/agents",     decoys: ["/bots", "/helpers", "/workers"],
    hint: "Plural of the obvious word." },

  { id: "cc-mcp",      category: "claude", difficulty: "hard", prompt: "Manage your MCP server connections",
    answer: "/mcp",        decoys: ["/servers", "/plugins", "/tools"],
    hint: "Three-letter acronym." },

  { id: "cc-perms",    category: "claude", difficulty: "hard", prompt: "Open the tool permissions / allow-list panel",
    answer: "/permissions",decoys: ["/access", "/allow", "/security"],
    hint: "What a parent gives a teen." },

  { id: "cc-hooks",    category: "claude", difficulty: "hard", prompt: "Configure automated scripts that fire on Claude events",
    answer: "/hooks",      decoys: ["/triggers", "/events", "/scripts"],
    hint: "Fishing word — gets things to bite." },

  { id: "cc-launch",   category: "claude", difficulty: "medium", prompt: "From the terminal, start a brand new Claude Code session",
    answer: "claude",      decoys: ["claude start", "claude new", "cc"],
    hint: "Just the name. Nothing else." },

  { id: "cc-resume",   category: "claude", difficulty: "hard", prompt: "Browse past Claude Code sessions and pick one to reopen",
    answer: "claude --resume", decoys: ["claude --history", "claude --reopen", "claude --sessions"],
    hint: "Pick up an earlier session — from a list.",
    explain: "claude --resume (-r) shows a list of past sessions to choose from. claude --continue (-c) skips the list and reopens the most recent one directly." },

  { id: "cc-print",    category: "claude", difficulty: "hard", prompt: "Run Claude with one prompt and print the answer (no chat UI)",
    answer: "claude --print", decoys: ["claude --once", "claude --quiet", "claude --output"],
    hint: "Like the printer on your desk.",
    explain: "claude --print (-p) runs one prompt headlessly and prints the result — ideal for scripts and pipes, with no interactive UI." },

  { id: "cc-interrupt",category: "claude", difficulty: "medium", prompt: "Stop Claude mid-response without quitting the session",
    answer: "Esc",         decoys: ["Ctrl+C", "Ctrl+Z", "q"],
    hint: "Top-left of your keyboard." },

  // ---------------- MAC TERMINAL (20) ----------------
  { id: "mac-pwd",     category: "mac", difficulty: "easy", prompt: "Print the folder you're currently in",
    answer: "pwd",         decoys: ["cwd", "here", "where"],
    hint: "Print Working Directory." },

  { id: "mac-ls",      category: "mac", difficulty: "easy", prompt: "List the files in the current folder",
    answer: "ls",          decoys: ["dir", "list", "show"],
    hint: "Two letters, the classic." },

  { id: "mac-ls-a",    category: "mac", difficulty: "medium", prompt: "List ALL files in the folder, including hidden ones",
    answer: "ls -a",       decoys: ["ls -h", "ls --hidden", "ls -all"],
    hint: "-a stands for 'all'." },

  { id: "mac-ls-lh",   category: "mac", difficulty: "hard", prompt: "Long list with human-readable file sizes (KB / MB)",
    answer: "ls -lh",      decoys: ["ls -l", "ls -hl", "ls --size"],
    hint: "l = long, h = human." },

  { id: "mac-cd",      category: "mac", difficulty: "easy", prompt: "Change into a folder called 'projects'",
    answer: "cd projects", decoys: ["go projects", "open projects", "enter projects"],
    hint: "cd = Change Directory." },

  { id: "mac-cd-up",   category: "mac", difficulty: "easy", prompt: "Go up one folder (to the parent directory)",
    answer: "cd ..",       decoys: ["cd up", "cd back", "cd -"],
    hint: "Two dots means 'parent'.",
    explain: "'..' always means the parent folder, so `cd ..` steps up one level. A single '.' means the folder you're already in." },

  { id: "mac-cd-home", category: "mac", difficulty: "medium", prompt: "Jump back to your home folder from anywhere",
    answer: "cd ~",        decoys: ["cd home", "cd /", "cd $"],
    hint: "The tilde is shorthand for home." },

  { id: "mac-mkdir",   category: "mac", difficulty: "easy", prompt: "Create a new folder called 'notes'",
    answer: "mkdir notes", decoys: ["newdir notes", "create notes", "folder notes"],
    hint: "MaKe DIRectory." },

  { id: "mac-touch",   category: "mac", difficulty: "medium", prompt: "Create an empty file called 'todo.txt'",
    answer: "touch todo.txt", decoys: ["new todo.txt", "create todo.txt", "make todo.txt"],
    hint: "Like tapping the file into existence." },

  { id: "mac-cp",      category: "mac", difficulty: "easy", prompt: "Copy 'a.txt' to a new file called 'b.txt'",
    answer: "cp a.txt b.txt", decoys: ["copy a.txt b.txt", "cp a.txt -> b.txt", "dup a.txt b.txt"],
    hint: "cp = CoPy." },

  { id: "mac-mv",      category: "mac", difficulty: "medium", prompt: "Rename 'old.txt' to 'new.txt'",
    answer: "mv old.txt new.txt", decoys: ["rename old.txt new.txt", "mv old.txt -> new.txt", "ren old.txt new.txt"],
    hint: "mv = MoVe (rename = move in place)." },

  { id: "mac-rm",      category: "mac", difficulty: "easy", prompt: "Delete a single file called 'junk.txt'",
    answer: "rm junk.txt", decoys: ["del junk.txt", "rm -d junk.txt", "trash junk.txt"],
    hint: "rm = ReMove." },

  { id: "mac-rm-r",    category: "mac", difficulty: "hard", prompt: "Delete a folder called 'old' and everything inside it",
    answer: "rm -r old",   decoys: ["rm old", "rmdir old", "rm -f old"],
    hint: "-r = recursive (go into subfolders).",
    explain: "-r means recursive, so rm descends into the folder and deletes everything inside. Plain rm refuses folders; rmdir only removes EMPTY ones." },

  { id: "mac-cat",     category: "mac", difficulty: "easy", prompt: "Print the contents of 'notes.txt' to the screen",
    answer: "cat notes.txt", decoys: ["print notes.txt", "show notes.txt", "read notes.txt"],
    hint: "Short for concatenate, but think 'spit it out'." },

  { id: "mac-less",    category: "mac", difficulty: "medium", prompt: "View a long file one screen at a time, scrollable",
    answer: "less big.log", decoys: ["more big.log", "page big.log", "view big.log"],
    hint: "Counter-intuitively named: 'less' is better than 'more'.",
    explain: "less pages through a file and scrolls BOTH directions; the older `more` only scrolls forward. Mnemonic: 'less is more'." },

  { id: "mac-grep",    category: "mac", difficulty: "medium", prompt: "Search inside files for the word 'TODO'",
    answer: "grep TODO",   decoys: ["find TODO", "search TODO", "match TODO"],
    hint: "Four letters, sounds like grabbing.",
    explain: "grep searches INSIDE files for text; `find` searches for files by name. Different tools for different jobs." },

  { id: "mac-find",    category: "mac", difficulty: "hard", prompt: "Find every file named '*.png' starting from the current folder",
    answer: "find . -name '*.png'", decoys: ["find *.png", "search . *.png", "locate *.png"],
    hint: "Dot = current folder, -name = match by filename." },

  { id: "mac-open",    category: "mac", difficulty: "easy", prompt: "Open the current folder in a Finder window",
    answer: "open .",      decoys: ["finder .", "show .", "reveal ."],
    hint: "Dot means 'right here'." },

  { id: "mac-chmod",   category: "mac", difficulty: "hard", prompt: "Make a script file 'run.sh' executable",
    answer: "chmod +x run.sh", decoys: ["chmod 777 run.sh", "exec run.sh", "make run.sh +x"],
    hint: "+x = add the eXecute permission.",
    explain: "+x adds the execute permission so the shell will run the file. `chmod 777` works too but over-grants read/write/execute to everyone." },

  { id: "mac-man",     category: "mac", difficulty: "medium", prompt: "Look up the manual / help page for the 'ls' command",
    answer: "man ls",      decoys: ["help ls", "ls --help", "info ls"],
    hint: "Short for MANual." },
];
