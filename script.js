const examBank = [
  {
    id: 1,
    level: "debutant",
    type: "Reponse courte",
    topic: "Fondements de l'agilite",
    points: 6,
    guidance: "Attendu : 4 a 6 lignes. Donne l'idee centrale de l'agilite et appuie-la avec deux valeurs du manifeste.",
    prompt: "Explique le principe fondamental de l'agilite. Appuie ta reponse en reliant ce principe a deux valeurs du manifeste agile.",
    source: "Examens : question sur le principe fondamental de l'agilite et liens avec les valeurs du manifeste. Cours pages 8 a 16.",
    criteria: [
      {
        label: "Explique que l'agilite vise a livrer rapidement de la valeur utile tout en s'adaptant au changement.",
        points: 2,
        evidenceSets: [
          ["valeur", "changement"],
          ["utile", "changement"],
          ["adapter", "changement"],
          ["livr", "valeur"]
        ]
      },
      {
        label: "Relie la reponse a la valeur individus et interactions plutot que processus et outils.",
        points: 2,
        evidenceSets: [
          ["individus", "interactions"],
          ["processus", "outils"]
        ]
      },
      {
        label: "Relie la reponse a une autre valeur du manifeste comme logiciel operationnel, collaboration client ou adaptation au changement.",
        points: 2,
        evidenceSets: [
          ["logiciel", "operationnel"],
          ["collaboration", "client"],
          ["adaptation", "changement"],
          ["suivi", "plan"]
        ]
      }
    ],
    modelAnswer: "Le principe fondamental de l'agilite est de livrer rapidement un logiciel utile au client tout en restant capable de s'adapter aux changements. L'agilite ne cherche pas seulement a suivre un plan : elle cherche surtout a produire de la valeur dans un contexte ou les besoins evoluent. Cela se voit dans la valeur qui donne priorite aux individus et aux interactions plutot qu'aux processus et aux outils, parce que la communication permet de reagir vite. On le voit aussi dans la priorite accordee a la collaboration avec le client et a l'adaptation aux changements plutot qu'au suivi rigide d'un plan."
  },
  {
    id: 2,
    level: "debutant",
    type: "Semi-developpement",
    topic: "Valeurs XP",
    points: 6,
    guidance: "Attendu : 4 a 6 lignes. Nomme au moins trois valeurs XP et explique brievement leur utilite.",
    prompt: "Presente les valeurs de XP et explique en quoi elles orientent le travail quotidien de l'equipe.",
    source: "Examens : questions sur les valeurs XP. Cours page 24.",
    criteria: [
      {
        label: "Nomme au moins trois valeurs XP parmi communication, simplicite, retroaction, courage, respect.",
        points: 2,
        evidenceSets: [
          ["communication", "simplic"],
          ["retroaction", "courage"],
          ["respect", "communication"],
          ["simplic", "respect"]
        ]
      },
      {
        label: "Explique que ces valeurs guident les decisions quotidiennes et pas seulement les grands principes abstraits.",
        points: 2,
        evidenceSets: [
          ["decision", "quotid"],
          ["travail", "quotid"],
          ["jour", "jour"]
        ]
      },
      {
        label: "Donne au moins un effet concret comme meilleure communication, code plus simple, feedback rapide ou confiance dans l'equipe.",
        points: 2,
        evidenceSets: [
          ["feedback", "rapide"],
          ["code", "simple"],
          ["communication", "rapide"],
          ["confiance", "equipe"]
        ]
      }
    ],
    modelAnswer: "XP repose sur cinq valeurs : la communication, la simplicite, la retroaction, le courage et le respect. Elles orientent le travail quotidien parce qu'elles poussent l'equipe a parler directement des problemes, a garder la solution la plus simple utile maintenant, a obtenir du feedback frequent grace aux tests et aux livraisons, a avoir le courage de refuser la complexite inutile ou de refactoriser, et a respecter le role de chacun. Ce ne sont pas seulement des slogans : elles influencent la facon d'ecrire, tester, planifier et collaborer."
  },
  {
    id: 3,
    level: "debutant",
    type: "Semi-developpement",
    topic: "Recits utilisateur",
    points: 6,
    guidance: "Attendu : 3 a 5 lignes. Donne la structure d'un recit et son avantage principal.",
    prompt: "Explique ce qu'est un recit utilisateur en XP et indique un avantage de cette facon d'exprimer un besoin.",
    source: "Examens : questions sur les recits utilisateurs. Cours page 41.",
    criteria: [
      {
        label: "Definit le recit utilisateur comme une fonctionnalite exprimee du point de vue de l'utilisateur ou du client.",
        points: 2,
        evidenceSets: [
          ["fonctionnalit", "utilisateur"],
          ["client", "besoin"],
          ["point de vue", "utilisateur"]
        ]
      },
      {
        label: "Mentionne la structure en tant que / je veux / afin de.",
        points: 2,
        evidenceSets: [
          ["en tant que", "je veux"],
          ["je veux", "afin de"],
          ["qui", "quoi", "pourquoi"]
        ]
      },
      {
        label: "Donne un avantage comme clarifier la valeur, centrer sur l'utilisateur ou faciliter la priorisation.",
        points: 2,
        evidenceSets: [
          ["valeur", "utilisateur"],
          ["priori", "client"],
          ["clarifi", "besoin"]
        ]
      }
    ],
    modelAnswer: "Un recit utilisateur est une courte description d'une fonctionnalite exprimee du point de vue de l'utilisateur ou du client. En XP, on l'ecrit souvent sous la forme : En tant que ..., je veux ..., afin de .... Cette formulation aide a garder l'accent sur la valeur d'affaire et pas seulement sur une tache technique. Elle facilite aussi la discussion avec le client et la priorisation des besoins."
  },
  {
    id: 4,
    level: "intermediaire",
    type: "Semi-developpement",
    topic: "Client present et artefacts",
    points: 8,
    guidance: "Attendu : 6 a 8 lignes. Nomme une pratique XP impliquant le client, explique en quoi elle reduit les artefacts, puis precise le risque si le client est peu present.",
    prompt: "La presence du client dans XP permet de reduire certains artefacts. Identifie une pratique XP impliquant le client qui permet cette reduction et explique le risque auquel le projet s'expose si le client est peu present.",
    source: "Examens : question sur la presence du client et la reduction des artefacts. Cours pages 31 a 33 et 43.",
    criteria: [
      {
        label: "Identifie une pratique pertinente comme client present, tests client, recits utilisateur ou jeu de planification.",
        points: 2,
        evidenceSets: [
          ["client present"],
          ["tests client"],
          ["jeu de planification"],
          ["recit", "utilisateur"]
        ]
      },
      {
        label: "Explique que la disponibilite du client remplace une partie des specifications detaillees ou de la documentation intermediaire.",
        points: 3,
        evidenceSets: [
          ["specification", "detail"],
          ["documentation", "moins"],
          ["artefact", "moins"],
          ["clarifier", "directement"]
        ]
      },
      {
        label: "Explique le risque si le client est absent : ambiguite des besoins, mauvaises priorites, mauvaises decisions ou rework.",
        points: 3,
        evidenceSets: [
          ["ambigu", "besoin"],
          ["mauvaise", "priorit"],
          ["rework"],
          ["malentendu"],
          ["mauvaise", "decision"]
        ]
      }
    ],
    modelAnswer: "Une pratique XP tres importante est le client present dans l'equipe. Comme le client est disponible pour repondre rapidement aux questions, l'equipe depend moins de specifications detaillees et de longs documents intermediaires pour comprendre le besoin. Les recits utilisateur et les tests d'acceptation peuvent suffire davantage, car l'information circule directement. Si le client est peu present, le projet s'expose a des malentendus, a des priorites mal choisies et a de la reprogrammation, parce que les developpeurs prennent des decisions avec une information incomplète."
  },
  {
    id: 5,
    level: "intermediaire",
    type: "Semi-developpement",
    topic: "Jeu de planification",
    points: 8,
    guidance: "Attendu : 5 a 7 lignes. Distingue clairement le role du client et celui des developpeurs.",
    prompt: "Explique le partage des responsabilites dans le jeu de planification XP. Que decide le client et qu'apportent les developpeurs ?",
    source: "Examens : question proche des droits et devoirs du client/developpeur. Cours pages 25 a 33.",
    criteria: [
      {
        label: "Explique que le client choisit la valeur, le but, les recits ou les priorites.",
        points: 3,
        evidenceSets: [
          ["client", "priorit"],
          ["client", "but"],
          ["client", "recit"],
          ["client", "valeur"]
        ]
      },
      {
        label: "Explique que les developpeurs fournissent les estimations, l'effort ou les contraintes techniques.",
        points: 3,
        evidenceSets: [
          ["developpeur", "estim"],
          ["effort", "implementation"],
          ["contrainte", "technique"],
          ["temps", "recit"]
        ]
      },
      {
        label: "Montre que ce partage favorise des decisions realistes et un meilleur alignement affaire-technique.",
        points: 2,
        evidenceSets: [
          ["realiste"],
          ["alignement"],
          ["feedback", "rapide"],
          ["equilibre", "affaire"]
        ]
      }
    ],
    modelAnswer: "Dans le jeu de planification XP, le client decide ce qui a de la valeur et fixe les priorites de livraison. Il choisit donc les recits a livrer et l'objectif de l'iteration ou de la version. Les developpeurs, eux, apportent leur evaluation technique : estimation d'effort, temps requis, complexite et contraintes. Le client ne doit pas imposer les decisions techniques, et les developpeurs ne doivent pas decider seuls de la valeur d'affaire. Ce partage permet de faire une planification plus realiste et mieux alignee sur les besoins reels."
  },
  {
    id: 6,
    level: "intermediaire",
    type: "Semi-developpement",
    topic: "Programmation par paire",
    points: 8,
    guidance: "Attendu : 5 a 7 lignes. Donne une definition, un avantage et un inconvenient nuance.",
    prompt: "En quoi consiste la programmation par paire ? Donne un avantage et un inconvenient en les expliquant brievement.",
    source: "Examens : question explicite sur la programmation par paire. Cours pages 37 et 45.",
    criteria: [
      {
        label: "Definit correctement la pratique comme deux personnes qui produisent ensemble le code sur un meme poste.",
        points: 2,
        evidenceSets: [
          ["deux", "meme ecran"],
          ["deux", "meme clavier"],
          ["deux", "code", "ensemble"]
        ]
      },
      {
        label: "Donne un avantage pertinent comme revue informelle, diffusion des connaissances ou propriete collective.",
        points: 3,
        evidenceSets: [
          ["revue", "informelle"],
          ["propriete", "collective"],
          ["diffusion", "connaissance"],
          ["qualite", "code"]
        ]
      },
      {
        label: "Donne un inconvenient plausible comme cout apparent, fatigue, besoin de bonne communication ou inefficacite si la paire fonctionne mal.",
        points: 3,
        evidenceSets: [
          ["cout"],
          ["fatigue"],
          ["communication"],
          ["mal", "fonctionne"],
          ["moins", "efficace"]
        ]
      }
    ],
    modelAnswer: "La programmation par paire consiste a faire ecrire le code de production par deux developpeurs travaillant ensemble sur un meme poste. Un avantage important est la revue informelle continue : les erreurs et les mauvaises decisions sont detectees plus tot, et la connaissance du code se diffuse mieux dans l'equipe. Un inconvenient est qu'elle peut sembler plus couteuse a court terme ou devenir fatigante si la communication entre les deux personnes est mauvaise. Son efficacité depend donc beaucoup du contexte et de la qualite de la collaboration."
  },
  {
    id: 7,
    level: "intermediaire",
    type: "Developpement",
    topic: "TDD, tests et qualite",
    points: 10,
    guidance: "Attendu : 7 a 10 lignes. Explique le lien entre tests et qualite, puis precise les limites du TDD.",
    prompt: "Explique la relation entre les tests et la qualite d'un logiciel. Les tests ou le TDD permettent-ils a eux seuls de creer la qualite ? Justifie ta reponse.",
    source: "Examens : questions sur tests, qualite et TDD. Cours pages 37, 43 et 44.",
    criteria: [
      {
        label: "Explique que les tests verifient la qualite ou revelent des problemes, mais ne remplacent pas une bonne conception.",
        points: 3,
        evidenceSets: [
          ["verif", "qualit"],
          ["revele", "probleme"],
          ["conception", "qualit"],
          ["ne", "remplace", "conception"]
        ]
      },
      {
        label: "Mentionne que le TDD aide a structurer l'implementation et a obtenir un feedback rapide.",
        points: 2,
        evidenceSets: [
          ["feedback", "rapide"],
          ["test", "avant"],
          ["structur", "implementation"],
          ["unitaire", "avant"]
        ]
      },
      {
        label: "Explique qu'on ne garantit pas une couverture complete ou tous les tests systeme avec le TDD seul.",
        points: 3,
        evidenceSets: [
          ["couverture", "complete"],
          ["test", "systeme"],
          ["global", "systeme"],
          ["pas", "suffisant"]
        ]
      },
      {
        label: "Conclut que la qualite depend aussi d'autres pratiques comme conception simple, refactoring, integration continue ou collaboration.",
        points: 2,
        evidenceSets: [
          ["refactoring"],
          ["integration continue"],
          ["conception simple"],
          ["collaboration"]
        ]
      }
    ],
    modelAnswer: "Les tests sont essentiels pour la qualite parce qu'ils permettent de verifier le comportement du logiciel et de reveler rapidement des defauts. Ils donnent donc de l'information sur la qualite, mais ils ne creent pas a eux seuls un bon logiciel. Le TDD, en particulier, aide a obtenir du feedback rapide et a structurer l'implementation autour de comportements verifiables. Cependant, le cours rappelle clairement que le TDD ne garantit pas une couverture complete : certains tests systeme ou certaines proprietes globales sont difficiles a faire emerger incrementiellement. La qualite depend donc aussi de la conception, du refactoring, de l'integration continue et d'une bonne collaboration avec le client."
  },
  {
    id: 8,
    level: "expert",
    type: "Developpement",
    topic: "Agilite versus approche disciplinee",
    points: 10,
    guidance: "Attendu : 8 a 10 lignes. Compare clairement les deux approches et donne un contexte precis ou le discipline est plus adapte.",
    prompt: "Pourquoi beaucoup de projets privilegient-ils une approche opportuniste ou agile ? Distingue-la clairement d'une approche plus systematique ou disciplinee et donne un contexte precis ou cette derniere est la plus appropriee.",
    source: "Examens : question sur opportuniste vs systematique, plus chapitre Agilite/XP. Cours pages 15, 18 a 20, 46 a 49 et 57.",
    criteria: [
      {
        label: "Explique que l'agilite est privilegiee quand les besoins changent, que la vitesse compte et qu'on veut du feedback rapide.",
        points: 3,
        evidenceSets: [
          ["besoin", "changent"],
          ["vitesse"],
          ["feedback", "rapide"],
          ["livraison", "increment"]
        ]
      },
      {
        label: "Distingue l'approche disciplinee par plus de planification, de conception et de documentation.",
        points: 3,
        evidenceSets: [
          ["planification"],
          ["documentation"],
          ["conception", "detail"],
          ["traceabil"]
        ]
      },
      {
        label: "Donne un contexte precis ou le discipline est preferable, par exemple systeme critique, reglemente, grand projet multi-equipes ou longue duree de vie.",
        points: 2,
        evidenceSets: [
          ["reglement"],
          ["critique"],
          ["grande", "equipe"],
          ["longue", "duree"],
          ["multi", "equipe"]
        ]
      },
      {
        label: "Montre que le bon choix depend du contexte et non d'un dogme.",
        points: 2,
        evidenceSets: [
          ["contexte"],
          ["adapter", "approche"],
          ["hybride"],
          ["pas", "dogme"]
        ]
      }
    ],
    modelAnswer: "Beaucoup de projets privilegient une approche agile ou opportuniste parce que les besoins evoluent, que le delai de reaction est crucial et qu'il faut obtenir du feedback rapide du client. Cette approche mise sur des livraisons frequentes, une planification adaptative et une forte communication. A l'inverse, une approche plus systematique ou disciplinee investit davantage dans la planification, la conception detaillee, la documentation et la tracabilite. Elle est mieux adaptee lorsqu'un systeme est critique, fortement reglemente, distribue entre plusieurs equipes ou appele a vivre longtemps. Le cours insiste toutefois sur le fait que le bon choix depend du contexte : en pratique, les approches hybrides sont souvent les plus performantes."
  },
  {
    id: 9,
    level: "expert",
    type: "Developpement",
    topic: "Agilite et grands projets",
    points: 10,
    guidance: "Attendu : 8 a 10 lignes. Nomme au moins deux difficultes et deux adaptations.",
    prompt: "Quels defis l'agilite rencontre-t-elle dans les grands projets et quelles adaptations le cours suggere-t-il pour y repondre ?",
    source: "Examens : question sur les grands projets. Cours pages 52 a 54.",
    criteria: [
      {
        label: "Identifie des difficultes comme plusieurs equipes, integration avec des systemes existants, utilisateurs multiples, faible flexibilite de certains requis ou reglementation.",
        points: 4,
        evidenceSets: [
          ["plusieurs", "equipes"],
          ["systemes", "existants"],
          ["utilisateurs", "differents"],
          ["reglement"],
          ["requis", "moins", "flexible"]
        ]
      },
      {
        label: "Explique que la cohesion ou la communication devient plus difficile a maintenir sur la duree.",
        points: 2,
        evidenceSets: [
          ["communication", "equipes"],
          ["cohesion"],
          ["longue", "periode"],
          ["continuite", "equipe"]
        ]
      },
      {
        label: "Donne une adaptation : davantage de conception ou documentation sur les aspects critiques.",
        points: 2,
        evidenceSets: [
          ["davantage", "conception"],
          ["documentation", "critique"],
          ["aspect", "critique"]
        ]
      },
      {
        label: "Donne une autre adaptation : mecanismes de communication inter-equipes ou canaux ouverts.",
        points: 2,
        evidenceSets: [
          ["communication", "inter", "equipes"],
          ["canaux", "ouverts"],
          ["mecanisme", "communication"]
        ]
      }
    ],
    modelAnswer: "L'agilite devient plus difficile a appliquer dans les grands projets parce qu'il y a souvent plusieurs equipes, des sous-systemes distincts, des integrations avec des systemes existants et des ensembles d'utilisateurs differents. Certains requis sont aussi moins flexibles, notamment lorsqu'ils touchent des interfaces externes ou des contraintes reglementaires. Sur des projets longs, il est egalement plus difficile de maintenir la cohesion et la continuite de l'equipe. Le cours suggere alors deux adaptations importantes : introduire davantage d'activites de conception et produire de la documentation sur les aspects critiques, puis etablir de vrais mecanismes de communication entre les equipes afin de garder les canaux ouverts."
  },
  {
    id: 10,
    level: "expert",
    type: "Developpement",
    topic: "Choix de l'approche selon le contexte",
    points: 10,
    guidance: "Attendu : 8 a 10 lignes. Choisis une approche et justifie en te basant sur les criteres du cours.",
    prompt: "Une equipe doit developper un systeme universitaire important, multilingue, integre a des systemes existants et soumis a plusieurs parties prenantes. Explique si une approche purement agile te semble suffisante et justifie ta reponse.",
    source: "Examens : style de question de justification contextuelle. Cours pages 47 a 54 et 57.",
    criteria: [
      {
        label: "Montre qu'une approche purement agile est probablement insuffisante dans ce contexte.",
        points: 3,
        evidenceSets: [
          ["pas", "suffisant"],
          ["insuffisant"],
          ["pas", "purement agile"],
          ["hybride"]
        ]
      },
      {
        label: "Justifie par la taille, les multiples parties prenantes, l'integration avec des systemes existants ou les exigences moins flexibles.",
        points: 3,
        evidenceSets: [
          ["parties prenantes"],
          ["systemes", "existants"],
          ["taille"],
          ["requis", "moins", "flexible"],
          ["integration"]
        ]
      },
      {
        label: "Propose une reponse nuancee : conserver des pratiques agiles mais renforcer conception, documentation et coordination.",
        points: 4,
        evidenceSets: [
          ["pratiques", "agiles"],
          ["documentation"],
          ["conception"],
          ["coordination"],
          ["communication", "equipes"]
        ]
      }
    ],
    modelAnswer: "Une approche purement agile me semble insuffisante dans un tel contexte. Le systeme est important, integre a des systemes existants, implique plusieurs parties prenantes et comporte des exigences qui ne seront pas toutes flexibles, surtout autour des integrations et des choix communs. On risque donc de manquer de coordination si on s'appuie seulement sur une agilite tres legere. En revanche, il ne faut pas abandonner les pratiques agiles utiles : feedback frequent, livraisons incrementales, implication du client et tests continus restent pertinents. La meilleure reponse est plutot une approche hybride qui conserve l'esprit agile tout en ajoutant davantage de conception, de documentation et de mecanismes de coordination inter-equipes."
  }
];

const levels = {
  debutant: {
    label: "Debutant",
    duration: 14,
    size: 3,
    description: "Questions courtes redigees pour valider les notions fondamentales et le vocabulaire du chapitre."
  },
  intermediaire: {
    label: "Intermediaire",
    duration: 28,
    size: 6,
    description: "Questions semi-developpement avec justification, comparaisons et mise en contexte XP."
  },
  expert: {
    label: "Expert",
    duration: 45,
    size: 10,
    description: "Simulation plus proche d'un vrai examen avec reponses construites et raisonnement nuance."
  }
};

const state = {
  selectedLevel: "intermediaire",
  questions: [],
  currentIndex: 0,
  answers: {},
  timerId: null,
  timeRemaining: 0
};

const totalQuestionCount = document.getElementById("total-question-count");
const levelGrid = document.getElementById("level-grid");
const startButton = document.getElementById("start-button");
const setupScreen = document.getElementById("setup-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const quizTitle = document.getElementById("quiz-title");
const timerDisplay = document.getElementById("timer-display");
const timerCard = document.getElementById("timer-card");
const progressLabel = document.getElementById("progress-label");
const topicLabel = document.getElementById("topic-label");
const progressFill = document.getElementById("progress-fill");
const questionDifficulty = document.getElementById("question-difficulty");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const answerHelper = document.getElementById("answer-helper");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const resultHeading = document.getElementById("result-heading");
const resultSummary = document.getElementById("result-summary");
const scoreDisplay = document.getElementById("score-display");
const gradeDisplay = document.getElementById("grade-display");
const correctCount = document.getElementById("correct-count");
const wrongCount = document.getElementById("wrong-count");
const timeStatus = document.getElementById("time-status");
const strengthList = document.getElementById("strength-list");
const improvementList = document.getElementById("improvement-list");
const reviewList = document.getElementById("review-list");
const retryButton = document.getElementById("retry-button");
const changeLevelButton = document.getElementById("change-level-button");

function init() {
  totalQuestionCount.textContent = examBank.length;
  renderLevelOptions();
  bindEvents();
}

function renderLevelOptions() {
  levelGrid.innerHTML = "";

  Object.entries(levels).forEach(([key, config]) => {
    const card = document.createElement("button");
    card.className = `level-option${state.selectedLevel === key ? " selected" : ""}`;
    card.type = "button";
    card.innerHTML = `
      <h3>${config.label}</h3>
      <p>${config.description}</p>
      <div class="level-meta">
        <span>${config.size} questions</span>
        <span>${config.duration} min</span>
      </div>
    `;

    card.addEventListener("click", () => {
      state.selectedLevel = key;
      renderLevelOptions();
    });

    levelGrid.appendChild(card);
  });
}

function bindEvents() {
  startButton.addEventListener("click", startExam);
  prevButton.addEventListener("click", () => moveQuestion(-1));
  nextButton.addEventListener("click", handleNextAction);
  retryButton.addEventListener("click", startExam);
  changeLevelButton.addEventListener("click", resetToSetup);
  answerInput.addEventListener("input", saveCurrentAnswer);
}

function startExam() {
  const config = levels[state.selectedLevel];

  state.questions = buildExamSet(state.selectedLevel, config.size);
  state.currentIndex = 0;
  state.answers = {};
  state.timeRemaining = config.duration * 60;

  clearInterval(state.timerId);
  state.timerId = setInterval(tick, 1000);

  setupScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  quizTitle.textContent = `${config.label} • Examen redige Agilite / XP`;
  renderQuestion();
  updateTimerUI();
}

function buildExamSet(level, size) {
  if (level === "expert") {
    return [...examBank];
  }

  if (level === "intermediaire") {
    return examBank.filter((question) => question.level !== "expert").slice(0, size);
  }

  return examBank.filter((question) => question.level === "debutant").slice(0, size);
}

function tick() {
  state.timeRemaining -= 1;
  updateTimerUI();

  if (state.timeRemaining <= 0) {
    clearInterval(state.timerId);
    finishExam(true);
  }
}

function updateTimerUI() {
  timerDisplay.textContent = formatTime(Math.max(0, state.timeRemaining));
  timerCard.classList.toggle("is-warning", state.timeRemaining <= 180 && state.timeRemaining > 60);
  timerCard.classList.toggle("is-danger", state.timeRemaining <= 60);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function saveCurrentAnswer() {
  const question = state.questions[state.currentIndex];
  state.answers[question.id] = answerInput.value.trim();
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
  const savedAnswer = state.answers[question.id] || "";

  progressLabel.textContent = `Question ${state.currentIndex + 1} / ${state.questions.length}`;
  topicLabel.textContent = `${question.topic} • ${question.points} points`;
  progressFill.style.width = `${progress}%`;
  questionDifficulty.textContent = `${question.level} • ${question.type}`;
  questionText.textContent = question.prompt;
  answerInput.value = savedAnswer;
  answerHelper.textContent = `${question.guidance} Reference de cours : ${question.source}`;

  prevButton.disabled = state.currentIndex === 0;
  prevButton.style.opacity = state.currentIndex === 0 ? "0.45" : "1";
  nextButton.textContent = state.currentIndex === state.questions.length - 1 ? "Terminer l'examen" : "Question suivante";
}

function moveQuestion(direction) {
  saveCurrentAnswer();

  const nextIndex = state.currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= state.questions.length) {
    return;
  }

  state.currentIndex = nextIndex;
  renderQuestion();
}

function handleNextAction() {
  saveCurrentAnswer();

  if (state.currentIndex === state.questions.length - 1) {
    finishExam(false);
    return;
  }

  moveQuestion(1);
}

function finishExam(timeExpired) {
  clearInterval(state.timerId);
  saveCurrentAnswer();

  const reviewedQuestions = state.questions.map((question) => gradeQuestion(question, state.answers[question.id] || ""));
  const earnedPoints = reviewedQuestions.reduce((total, question) => total + question.score, 0);
  const totalPoints = reviewedQuestions.reduce((total, question) => total + question.points, 0);
  const percentage = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  const elapsedSeconds = Math.max(0, levels[state.selectedLevel].duration * 60 - state.timeRemaining);

  quizScreen.classList.add("hidden");
  resultsScreen.classList.remove("hidden");

  renderResults({
    reviewedQuestions,
    earnedPoints,
    totalPoints,
    percentage,
    elapsedSeconds,
    timeExpired
  });
}

function gradeQuestion(question, rawAnswer) {
  const normalizedAnswer = normalize(rawAnswer);
  const criteriaResults = question.criteria.map((criterion) => {
    const matched = criterion.evidenceSets.some((evidenceSet) => evidenceSet.every((fragment) => normalizedAnswer.includes(normalize(fragment))));
    return {
      ...criterion,
      matched
    };
  });

  const score = criteriaResults.reduce((total, criterion) => total + (criterion.matched ? criterion.points : 0), 0);
  const matchedCount = criteriaResults.filter((criterion) => criterion.matched).length;

  return {
    ...question,
    answer: rawAnswer,
    score,
    matchedCount,
    criteriaResults
  };
}

function normalize(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderResults({ reviewedQuestions, earnedPoints, totalPoints, percentage, elapsedSeconds, timeExpired }) {
  const solidAnswers = reviewedQuestions.filter((question) => question.score >= Math.ceil(question.points * 0.6)).length;
  const weakAnswers = reviewedQuestions.length - solidAnswers;
  const grade = computeGrade(percentage);

  resultHeading.textContent =
    percentage >= 80
      ? "Tres bonne maitrise des questions redigees"
      : percentage >= 60
        ? "Bonne base, mais il faut approfondir la justification"
        : "Les notions sont la, mais les reponses restent trop fragiles";

  resultSummary.textContent = timeExpired
    ? "Le temps est ecoule. Voici une correction complete avec une note indicative basee sur les elements attendus du cours."
    : "Voici ton bilan final. La note est indicative : elle repose sur les elements attendus detectes dans tes reponses et sur une correction modele question par question.";

  scoreDisplay.textContent = `${percentage}%`;
  gradeDisplay.textContent = `${grade} • ${earnedPoints}/${totalPoints}`;
  correctCount.textContent = solidAnswers;
  wrongCount.textContent = weakAnswers;
  timeStatus.textContent = formatTime(elapsedSeconds);

  strengthList.innerHTML = computeStrengths(reviewedQuestions, percentage).map((item) => `<li>${item}</li>`).join("");
  improvementList.innerHTML = computeImprovements(reviewedQuestions, percentage).map((item) => `<li>${item}</li>`).join("");
  reviewList.innerHTML = reviewedQuestions.map(renderReviewItem).join("");
}

function computeGrade(percentage) {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Tres bien";
  if (percentage >= 60) return "Passable";
  return "A revoir";
}

function computeStrengths(reviewedQuestions, percentage) {
  const strengths = [];
  const strongTopics = reviewedQuestions
    .filter((question) => question.score >= Math.ceil(question.points * 0.7))
    .slice(0, 2)
    .map((question) => question.topic);

  if (percentage >= 75) {
    strengths.push("Tes reponses couvrent globalement les idees centrales du chapitre et pas seulement des definitions isolees.");
  } else {
    strengths.push("Tu as deja une base de contenu utile pour produire de meilleures reponses au prochain passage.");
  }

  if (strongTopics.length > 0) {
    strengths.push(`Les themes les mieux maitrises actuellement sont : ${strongTopics.join(" et ")}.`);
  }

  strengths.push("La correction modele te donne des formulations plus proches de ce qu'on attend dans une vraie copie.");
  return strengths;
}

function computeImprovements(reviewedQuestions, percentage) {
  const weakest = [...reviewedQuestions]
    .sort((left, right) => (left.score / left.points) - (right.score / right.points))
    .slice(0, 2)
    .map((question) => question.topic);

  const improvements = [];

  if (weakest[0]) {
    improvements.push(`Priorite de revision : ${weakest[0]}.`);
  }

  if (weakest[1]) {
    improvements.push(`Deuxieme theme a retravailler : ${weakest[1]}.`);
  }

  if (percentage < 60) {
    improvements.push("Travaille surtout la structure de tes reponses : idee principale, justification, exemple ou consequence.");
  } else {
    improvements.push("Tes reponses gagneraient encore en precision si tu relies plus explicitement chaque idee aux pratiques ou valeurs du cours.");
  }

  improvements.push("Compare toujours ta copie aux elements attendus et reformule ensuite a l'ecrit sans regarder le modele.");
  return improvements;
}

function renderReviewItem(question, index) {
  const criteriaList = question.criteriaResults
    .map((criterion) => `
      <li class="${criterion.matched ? "criterion-hit" : "criterion-miss"}">
        ${criterion.matched ? "Valide" : "Manque"} • ${criterion.label} (${criterion.points} pts)
      </li>
    `)
    .join("");

  return `
    <article class="review-item ${question.score >= Math.ceil(question.points * 0.6) ? "correct" : "wrong"}">
      <div class="review-topline">
        <strong>Question ${index + 1} • ${question.topic}</strong>
        <span class="review-status">${question.score}/${question.points}</span>
      </div>
      <h3>${question.prompt}</h3>
      <p class="review-answer"><strong>Ta reponse :</strong> ${question.answer ? escapeHtml(question.answer) : "Aucune reponse."}</p>
      <p class="review-answer"><strong>Correction modele :</strong> ${escapeHtml(question.modelAnswer)}</p>
      <p class="review-explanation"><strong>Elements attendus :</strong></p>
      <ul class="criteria-list">${criteriaList}</ul>
      <p class="review-explanation"><strong>Reference :</strong> ${escapeHtml(question.source)}</p>
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function resetToSetup() {
  clearInterval(state.timerId);
  quizScreen.classList.add("hidden");
  resultsScreen.classList.add("hidden");
  setupScreen.classList.remove("hidden");
  renderLevelOptions();
}

init();
