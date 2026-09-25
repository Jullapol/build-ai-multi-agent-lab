from docx import Document
from docx.shared import Pt, Inches


def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style='List Bullet')
        p.add_run(item)


doc = Document()
for section in doc.sections:
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.75)
    section.right_margin = Inches(0.75)

# Title
p = doc.add_paragraph()
r = p.add_run('Teaching Guide: Build AI Multi-Agent Lab for Novice AI Developers')
r.bold = True
r.font.size = Pt(22)
doc.add_paragraph('A professional teaching explanation for students learning how to work with AI-assisted development in a real engineering workflow.')

# 1

doc.add_heading('1. Why this project is a good learning project', level=1)
doc.add_paragraph(
    'This project is a strong teaching project because it is not only a demo website. It combines real workflow, architecture, testing, shared-state management, agent collaboration, and deployment. A student can see how ideas become a working system with evidence.'
)
doc.add_paragraph('A novice AI developer learns five important things here:')
add_bullets(doc, [
    'How to set up a real project environment correctly.',
    'How to organize work using agents and ownership boundaries.',
    'How to validate work with tests, QA, and API checks.',
    'How to maintain shared state in files instead of relying on chat memory.',
    'How to ship and verify a project without making unrealistic deployment claims.'
])

# 2

doc.add_heading('2. What this project teaches', level=1)
doc.add_paragraph(
    'The project teaches students to think like software engineers while working with AI tools. It is not about asking an AI to generate code quickly. It is about building a disciplined workflow for AI-assisted development.'
)
for title, description in [
    ('Project setup and environment discipline', 'Students learn that dependencies, tool installation, and environment variables are part of engineering work. They also learn not to commit node_modules or secrets.'),
    ('Software architecture', 'The project uses Astro, Node SSR, SQLite, pages, layouts, and API routes. Students learn how a web app is structured and how code is separated by responsibility.'),
    ('Multi-agent collaboration', 'The project defines ownership clearly: frontend, backend, review, QA, and deployment are separate concerns. Students learn that clear responsibilities reduce confusion and errors.'),
    ('Shared state and documentation', 'Instead of depending only on chat history, the project uses docs like STATUS, OPEN_LOOPS, and handoffs. This teaches professional habits for context sharing and continuity.'),
    ('Testing and quality assurance', 'The repo includes smoke tests, lab tests, and E2E flows. Students learn that code quality is proven by validation, not by assumption.'),
    ('Deployment readiness', 'The project teaches not to claim success without evidence. Production work requires a valid URL and real response checks.')
]:
    doc.add_heading(f'2.1 {title}', level=2)
    doc.add_paragraph(description)

# 3

doc.add_heading('3. What is inside the project', level=1)
doc.add_paragraph('This repository has both a real application and a structured learning curriculum. That is one reason it is powerful as a training project. Students can inspect the software and the process together.')
for label, detail in [
    ('README.md', 'This is the project entry point and explains the learning path.'),
    ('COURSE.md', 'This explains the four pillars of the course: multi-agent work, sub-agents, coordination, and swarm discipline.'),
    ('AGENTS.md', 'This defines the ownership rules and communication constraints for the agents.'),
    ('src/', 'This is the working web application: layouts, pages, API routes, and library code.'),
    ('docs/', 'This folder stores the source of truth including profile, decisions, hot state, and handoffs.'),
    ('tests/', 'These files validate correctness and teach testing behavior.'),
    ('labs/', 'This is the step-by-step teaching roadmap for the entire course.'),
]:
    p = doc.add_paragraph()
    r = p.add_run(label)
    r.bold = True
    p.add_run(': ' + detail)

# 4

doc.add_heading('4. The learning path in this project', level=1)
doc.add_paragraph('The project is designed like a guided curriculum. Students do not skip steps. They progress from setup to architecture to review to deployment. This is exactly how real engineering learning should work.')
lab_steps = [
    ('Lab 00', 'Initialize the project, install dependencies, configure the tools, set up agent ownership, and create the state files.'),
    ('Lab 01', 'Interview and profile creation. Students turn ideas into structured content.'),
    ('Lab 02', 'Debate and decision-making using sub-agents and document-based synthesis.'),
    ('Lab 03', 'Turn decisions into actionable issues and planning tasks.'),
    ('Lab 04', 'Build the frontend and validate API contracts before moving on.'),
    ('Lab 05', 'Implement backend logic and database behavior with tests.'),
    ('Lab 05b', 'Use swarm patterns with a strict turn ceiling to stay focused and efficient.'),
    ('Lab 06', 'QA and end-to-end validation from the user experience perspective.'),
    ('Lab 07', 'Cross-model review and critique using evidence and documented state.'),
    ('Lab 08', 'Ship the project and verify the production URL is actually live.'),
]
for idx, (title, detail) in enumerate(lab_steps, start=1):
    doc.add_heading(f'4.{idx} {title}', level=2)
    doc.add_paragraph(detail)

# 5

doc.add_heading('5. Key principles a teacher should teach', level=1)
doc.add_paragraph('When teaching this project, the teacher should focus on the engineering principles, not just the code output.')
add_bullets(doc, [
    'Ownership matters: each agent has a defined area of responsibility.',
    'Shared truth should live in files, not in a single chat thread.',
    'Validation is proof: a feature is not complete until it passes checks.',
    'AI is a multiplier, not a substitute for judgment and system design.',
    'Context and memory should be handled intentionally and professionally.',
    'Professional delivery requires evidence, not optimism.'
])

# 6

doc.add_heading('6. How to teach this to beginners', level=1)
doc.add_paragraph('The best beginner path is to teach the student to understand the structure before they ask the AI to generate code. Walk them through the folders, explain each file’s purpose, and then let them work one layer at a time.')
add_bullets(doc, [
    'Start by reading the README and COURSE files.',
    'Teach the meaning of AGENTS, STATUS, OPEN_LOOPS, and handoffs.',
    'Have the student explain the current task before editing code.',
    'Require them to validate results with tests after each change.',
    'Show them how to review the project from a software engineering perspective.',
    'Explain that a useful AI developer is disciplined, not merely creative.'
])

# 7

doc.add_heading('7. Skills students gain from this course', level=1)
doc.add_paragraph('By the end of the project, a beginner AI developer should be able to:')
add_bullets(doc, [
    'Set up a full-stack project on Windows and manage local tooling.',
    'Work with AI coding agents using role separation and ownership rules.',
    'Read and maintain project documentation as a source of truth.',
    'Build and validate a real web product from frontend to backend.',
    'Write and run tests for behavior instead of assumptions.',
    'Review AI-generated work with evidence and guardrails.',
    'Prepare a deployable project and confirm it is live.'
])

# 8

doc.add_heading('8. Final teacher summary', level=1)
doc.add_paragraph('This project is valuable because it teaches students how to use AI as part of a disciplined engineering workflow. It is not just about generating code. It is about understanding architecture, state, testing, collaboration, and verification. A student who completes this project is learning how to act like a professional AI developer, not just a prompt user.')
doc.add_paragraph('In short, this project trains a novice to become a reliable AI developer by combining software craftsmanship with clear process and evidence-based execution.')

out_file = r'C:\Users\Lenovo\Downloads\dev\demo\build-ai-multi-agent-lab\AI_Developer_Training_Guide.docx'
doc.save(out_file)
print(out_file)
