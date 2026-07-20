import {
  Button,
  Callout,
  Code,
  Divider,
  H1,
  H2,
  Row,
  Spacer,
  Stack,
  Stat,
  Text,
  TodoList,
  useCanvasState,
  type TodoItem,
  type TodoStatus,
} from "cursor/canvas";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  tryHint: string;
};

const LESSON_CATALOG: Lesson[] = [
  {
    id: "modes",
    title: "Agent / Ask / Plan / Debug",
    summary: "Pick the right mode for build vs explore vs plan vs hard bugs.",
    tryHint: "Switch modes once and ask the same question in Ask vs Agent.",
  },
  {
    id: "mentions",
    title: "@ mentions",
    summary:
      "Scope context with @file, @folder, @codebase before dumping the whole repo.",
    tryHint: "Ask about one module using @file only.",
  },
  {
    id: "diffs",
    title: "Diff review",
    summary: "Accept or reject proposed edits per hunk before they stick.",
    tryHint:
      "Have Agent make a tiny edit; accept one hunk and reject another.",
  },
  {
    id: "plan-vs-agent",
    title: "Plan vs Agent",
    summary: "Plan when scope is fuzzy; Agent when the path is clear.",
    tryHint:
      "Ask for a plan-only approach to a small feature — no implementation yet.",
  },
  {
    id: "context-scope",
    title: "Context scope",
    summary: "Prefer @folder or @file over @codebase for focused edits.",
    tryHint: "Compare one ask with @file vs @folder.",
  },
  {
    id: "queue",
    title: "Message queue",
    summary:
      "Send follow-ups while Agent runs; reorder without stopping work.",
    tryHint: "Send one follow-up while a task is in progress.",
  },
  {
    id: "side-chat",
    title: "Side chat",
    summary:
      "Parallel agent threads for tangents without derailing the main task.",
    tryHint: "Start a main task, then /side with one question, then return.",
  },
  {
    id: "designer-mode",
    title: "Designer mode",
    summary:
      "Point at running UI in the Agents Window browser and edit by selection.",
    tryHint:
      "Open browser → Cmd+Shift+D → click an element → request one visual tweak.",
  },
  {
    id: "canvases",
    title: "Canvases",
    summary:
      "Live React artifacts beside chat for maps, tables, and interactive boards.",
    tryHint: "Keep this map open; ask for a small comparison canvas next.",
  },
  {
    id: "plugins",
    title: "Plugins",
    summary: "Customize → Plugins — packaged bundles vs raw MCP.",
    tryHint:
      "Open Customize → Plugins, browse or install one, run one plugin-backed task.",
  },
  {
    id: "hooks",
    title: "Hooks",
    summary:
      "Lifecycle scripts in .cursor/hooks.json that gate or audit agent events.",
    tryHint:
      "Open Customize → Hooks; inspect or add a minimal beforeShellExecution hook.",
  },
  {
    id: "rules",
    title: "Rules",
    summary:
      "Always-on preferences via Customize → Rules or .cursor/rules.",
    tryHint:
      "Open Customize → Rules and note Always vs Intelligent vs Manual.",
  },
  {
    id: "skills",
    title: "Skills",
    summary:
      "On-demand workflows via /skill-name — better than rules for multi-step jobs.",
    tryHint: "Run /learn-cursor or /create-skill and observe what loads.",
  },
  {
    id: "cloud-agents",
    title: "Cloud Agents",
    summary: "Long or parallel work in a cloud VM; review when ready.",
    tryHint:
      "Open cursor.com/agents or Agents Window cloud entry and note local vs cloud.",
  },
  {
    id: "automations",
    title: "Automations",
    summary: "Scheduled or trigger-based agents for recurring maintenance.",
    tryHint: "Peek at Automations UI; note one trigger you might use.",
  },
  {
    id: "bugbot",
    title: "Bugbot",
    summary:
      "Automated PR review for bugs and security — not a substitute for Agent.",
    tryHint:
      "Check whether Bugbot is connected on a recent PR or settings.",
  },
];

/** Canonical order — coach scopes by filtering this list. */
const FULL_TOUR_LESSON_ORDER = LESSON_CATALOG.map((l) => l.id);

function lessonById(): Map<string, Lesson> {
  return new Map(LESSON_CATALOG.map((l) => [l.id, l]));
}

function lessonStatus(
  lessonId: string,
  selectedId: string,
  completed: Record<string, boolean>,
): TodoStatus {
  if (completed[lessonId]) return "completed";
  if (lessonId === selectedId) return "in_progress";
  return "pending";
}

export default function LearnCursorMap() {
  const [inScopeLessonIds, setInScopeLessonIds] = useCanvasState<string[]>(
    "inScopeLessonIds",
    [],
  );
  const [selectedLessonId, setSelectedLessonId] = useCanvasState<string>(
    "selectedLesson",
    "modes",
  );
  const [completed, setCompleted] = useCanvasState<Record<string, boolean>>(
    "completed",
    {},
  );

  const byId = lessonById();
  const planIds =
    inScopeLessonIds.length > 0
      ? inScopeLessonIds.filter((id) => byId.has(id))
      : [...FULL_TOUR_LESSON_ORDER];

  const planLessons = planIds.map((id) => byId.get(id)!);
  const selected =
    planLessons.find((l) => l.id === selectedLessonId) ?? planLessons[0];

  const planDone = planIds.filter((id) => completed[id]).length;
  const catalogDone = FULL_TOUR_LESSON_ORDER.filter((id) => completed[id]).length;

  const todos: TodoItem[] = planLessons.map((lesson) => ({
    id: lesson.id,
    content: lesson.title,
    status: lessonStatus(lesson.id, selected?.id ?? "", completed),
  }));

  function onTodoClick(todo: TodoItem) {
    setSelectedLessonId(todo.id);
  }

  function toggleComplete(id: string, value: boolean) {
    setCompleted((prev) => ({ ...prev, [id]: value }));
  }

  function showFullCatalog() {
    setInScopeLessonIds([...FULL_TOUR_LESSON_ORDER]);
    setSelectedLessonId(FULL_TOUR_LESSON_ORDER[0]);
  }

  const scoped = inScopeLessonIds.length > 0;

  return (
    <Stack gap={20} style={{ padding: 16 }}>
      <Stack gap={6}>
        <H1>Learn Cursor</H1>
        <Text tone="secondary">
          Your coach scoped these lessons from your goals. Select one, then tap{" "}
          <Code>Start</Code> in your Learn Cursor chat.
        </Text>
      </Stack>

      <Row gap={16} wrap>
        <Stat
          value={`${planDone}/${planIds.length}`}
          label="Your plan complete"
          tone={
            planDone === planIds.length && planIds.length > 0
              ? "success"
              : undefined
          }
        />
        <Stat
          value={`${planIds.length}`}
          label="Lessons in scope"
          tone="info"
        />
        <Stat
          value={`${catalogDone}/${FULL_TOUR_LESSON_ORDER.length}`}
          label="All lessons (catalog)"
        />
      </Row>

      {!scoped && (
        <Callout tone="info" title="Not scoped yet">
          Complete discovery in chat — your coach will set lessons in scope from
          your goal selections. Showing full catalog until then.
        </Callout>
      )}

      {scoped && planIds.length < FULL_TOUR_LESSON_ORDER.length && (
        <Row gap={8} align="center">
          <Text tone="secondary" size="small">
            Want everything?{" "}
          </Text>
          <Button variant="ghost" onClick={showFullCatalog}>
            Show full catalog ({FULL_TOUR_LESSON_ORDER.length} lessons)
          </Button>
        </Row>
      )}

      <Divider />

      <Row gap={20} align="start">
        <Stack gap={8} style={{ flex: 1, minWidth: 220 }}>
          <H2>Your plan</H2>
          <Text tone="tertiary" size="small">
            Click a row to select it, then tap Start in chat.
          </Text>
          <TodoList todos={todos} onTodoClick={onTodoClick} />
        </Stack>

        <Stack gap={12} style={{ flex: 1.4, minWidth: 260 }}>
          {selected ? (
            <>
              <H2>{selected.title}</H2>
              <Text>{selected.summary}</Text>
              <Callout tone="info" title="Try">
                {selected.tryHint}
              </Callout>

              <Callout tone="success" title="Selected — start in chat">
                <Stack gap={8}>
                  <Text>
                    In the chat that opened this map, use the question control:
                  </Text>
                  <Text>
                    <Code>Start</Code> · <Code>Not yet</Code> ·{" "}
                    <Code>Rescope plan</Code>
                  </Text>
                  <Text tone="secondary" size="small">
                    Start reads this selection and begins the lesson.
                  </Text>
                </Stack>
              </Callout>

              <Button
                variant="secondary"
                onClick={() =>
                  toggleComplete(selected.id, !completed[selected.id])
                }
              >
                {completed[selected.id] ? "Mark incomplete" : "Mark complete"}
              </Button>
            </>
          ) : (
            <Text tone="secondary">No lessons in scope yet.</Text>
          )}
        </Stack>
      </Row>

      <Spacer />
      <Row gap={8} align="center">
        <Button variant="ghost" onClick={() => setCompleted({})}>
          Reset all progress
        </Button>
        <Text tone="tertiary" size="small">
          {planDone} of {planIds.length} in your plan · {catalogDone} of{" "}
          {FULL_TOUR_LESSON_ORDER.length} catalog-wide
        </Text>
      </Row>
    </Stack>
  );
}
