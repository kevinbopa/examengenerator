export const examBlueprint = {
  title: "Examen complet - Agilite et Extreme Programming",
  chapter: "H26_GLO2003_09_Agilite_XP",
  durationMinutes: 70,
  description:
    "Examen de revision complet inspire du style de questions observe dans examens.md. Il couvre les valeurs, principes, limites et pratiques du chapitre Agilite / XP.",
  sections: [
    {
      id: "qcm",
      label: "QCM",
      title: "Partie 1 - Questions a choix multiples",
      accent: "amber",
      instructions:
        "Choisis la meilleure reponse. Cette partie valide la memorisation precise des notions de base du chapitre.",
      questions: [
        {
          id: "qcm-1",
          type: "mcq",
          topic: "Manifeste agile",
          points: 2,
          prompt: "Quel enonce traduit le mieux l'esprit du manifeste agile ?",
          options: [
            "Le respect strict du plan prime sur l'adaptation aux changements.",
            "Les individus et les interactions priment sur les processus et les outils.",
            "La documentation complete est la mesure principale du progres.",
            "Le client doit intervenir seulement a la fin pour valider le produit."
          ],
          correctOption: 1,
          explanation:
            "Le manifeste agile valorise d'abord les individus et les interactions. L'agilite mise sur la collaboration humaine pour mieux reagir aux changements.",
          source: "Cours pages 8 a 12."
        },
        {
          id: "qcm-2",
          type: "mcq",
          topic: "Valeurs XP",
          points: 2,
          prompt: "Lequel des elements suivants n'est pas une valeur XP ?",
          options: ["Communication", "Simplicite", "Retroaction", "Documentation exhaustive"],
          correctOption: 3,
          explanation:
            "Les valeurs XP sont communication, simplicite, retroaction, courage et respect. La documentation exhaustive n'en fait pas partie.",
          source: "Cours page 24."
        },
        {
          id: "qcm-3",
          type: "mcq",
          topic: "Pratiques XP",
          points: 2,
          prompt: "Quelle pratique XP vise explicitement a ameliorer le code sans changer son comportement externe ?",
          options: ["Metaphore", "Reusinage", "Jeu de planification", "Client present"],
          correctOption: 1,
          explanation:
            "Le reusinage, ou refactoring, est la transformation du code pour l'ameliorer sans modifier le comportement observable.",
          source: "Cours page 38."
        },
        {
          id: "qcm-4",
          type: "mcq",
          topic: "Integration continue",
          points: 2,
          prompt: "Dans l'esprit de XP, quel est le principal benefice de l'integration continue ?",
          options: [
            "Retarder les tests jusqu'a la fin de la version",
            "Detecter rapidement les problemes d'integration et garder une base stable",
            "Permettre a chacun de garder son code local plus longtemps",
            "Remplacer completement les tests client"
          ],
          correctOption: 1,
          explanation:
            "L'integration continue sert a integrer tot, tester souvent et maintenir une version saine du systeme.",
          source: "Cours page 35."
        },
        {
          id: "qcm-5",
          type: "mcq",
          topic: "Grands projets",
          points: 2,
          prompt: "Quel defi est typiquement rencontre lorsqu'on applique l'agilite a de grands projets ?",
          options: [
            "Trop peu de sous-systemes et trop peu d'utilisateurs",
            "La coordination entre plusieurs equipes et contraintes externes",
            "Une simplicite excessive du contexte d'affaires",
            "L'absence de besoins partages entre acteurs"
          ],
          correctOption: 1,
          explanation:
            "Les grands projets impliquent souvent plusieurs equipes, integrations existantes, utilisateurs multiples et exigences moins flexibles.",
          source: "Cours pages 52 a 54."
        },
        {
          id: "qcm-6",
          type: "mcq",
          topic: "Recits utilisateur",
          points: 2,
          prompt: "Quel patron de redaction correspond a un recit utilisateur ?",
          options: [
            "En tant que qui, je veux quoi afin de pourquoi",
            "Si le code compile, alors le besoin est satisfait",
            "Une fonctionnalite vaut une iteration complete",
            "Le client precise tout le design avant l'implementation"
          ],
          correctOption: 0,
          explanation:
            "Le patron classique du recit utilisateur garde le besoin centre sur l'acteur, l'action voulue et la valeur visee.",
          source: "Cours page 41."
        }
      ]
    },
    {
      id: "semi",
      label: "Semi-developpement",
      title: "Partie 2 - Questions semi-developpement",
      accent: "teal",
      instructions:
        "Reponds de facon courte mais structuree. On attend une idee centrale, une justification et un lien clair avec le cours.",
      questions: [
        {
          id: "semi-1",
          type: "written",
          responseStyle: "semi",
          topic: "Principe fondamental de l'agilite",
          points: 6,
          guidance: "Attendu : 4 a 6 lignes. Relie ton explication a deux valeurs du manifeste agile.",
          prompt:
            "Explique le principe fondamental de l'agilite. Appuie ta reponse en reliant ce principe a deux valeurs du manifeste agile.",
          source: "Examens.md : questions sur le principe fondamental de l'agilite et les valeurs du manifeste.",
          criteria: [
            {
              label: "Explique que l'agilite cherche a livrer rapidement de la valeur utile tout en s'adaptant au changement.",
              points: 2,
              evidenceSets: [
                ["valeur", "changement"],
                ["livr", "valeur"],
                ["adapter", "changement"]
              ]
            },
            {
              label: "Relie la reponse a la valeur individus et interactions plutot que processus et outils.",
              points: 2,
              evidenceSets: [["individus", "interactions"], ["processus", "outils"]]
            },
            {
              label: "Relie la reponse a une autre valeur du manifeste, par exemple collaboration client, logiciel operationnel ou adaptation au changement.",
              points: 2,
              evidenceSets: [
                ["collaboration", "client"],
                ["logiciel", "operationnel"],
                ["adaptation", "changement"],
                ["suivi", "plan"]
              ]
            }
          ],
          modelAnswer:
            "Le principe fondamental de l'agilite est de produire rapidement un logiciel utile au client tout en restant capable de s'adapter aux changements. Dans un contexte ou les besoins evoluent, l'objectif n'est pas de suivre rigidement un plan, mais de livrer de la valeur. Cela rejoint la valeur qui privilegie les individus et les interactions plutot que les processus et les outils, parce que la communication permet de reagir vite. Cela rejoint aussi la collaboration avec le client et l'adaptation aux changements plutot que le suivi rigide d'un plan."
        },
        {
          id: "semi-2",
          type: "written",
          responseStyle: "semi",
          topic: "Presence du client et artefacts",
          points: 8,
          guidance:
            "Attendu : 5 a 7 lignes. Identifie une pratique XP impliquant le client, explique la reduction d'artefacts et le risque si le client est absent.",
          prompt:
            "La presence du client dans XP permet certains choix pour les activites et la documentation d'un projet. Identifie une pratique XP impliquant le client qui permet de reduire les artefacts. A quel risque cette pratique expose-t-elle le projet si le client est peu present ?",
          source: "Examens.md : question sur client present, artefacts et risque. Cours pages 31 a 33 et 43.",
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
              label: "Explique que cette pratique permet de reduire le besoin de specifications detaillees ou d'artefacts intermediaires.",
              points: 3,
              evidenceSets: [
                ["specification", "detail"],
                ["documentation", "moins"],
                ["artefact", "moins"],
                ["information", "direct"]
              ]
            },
            {
              label: "Explique un risque comme ambiguite des besoins, mauvaises priorites, malentendus ou rework si le client est peu present.",
              points: 3,
              evidenceSets: [
                ["ambigu", "besoin"],
                ["mauvaise", "priorit"],
                ["malentendu"],
                ["rework"],
                ["mauvaise", "decision"]
              ]
            }
          ],
          modelAnswer:
            "Une pratique XP importante est le client present dans l'equipe. Comme le client peut repondre rapidement aux questions, on depend moins de longues specifications detaillees ou de plusieurs documents intermediaires pour comprendre le besoin. Les recits utilisateur et les tests d'acceptation peuvent alors suffire davantage. En revanche, si le client est peu present, le projet s'expose a des malentendus, a de mauvaises priorites et a de la reprogrammation, parce que les developpeurs prennent des decisions avec une information incomplete."
        },
        {
          id: "semi-3",
          type: "written",
          responseStyle: "semi",
          topic: "Programmation par paire",
          points: 8,
          guidance: "Attendu : 5 a 7 lignes. Donne une definition, un avantage et un inconvenient nuance.",
          prompt:
            "En quoi consiste la programmation par paire ? Identifie un avantage et un inconvenient, puis explique-les brievement.",
          source: "Examens.md : question sur la programmation par paire. Cours pages 37 et 45.",
          criteria: [
            {
              label: "Definit correctement la programmation par paire comme deux developpeurs qui produisent ensemble le code sur un meme poste.",
              points: 2,
              evidenceSets: [
                ["deux", "code", "ensemble"],
                ["meme", "ecran"],
                ["meme", "clavier"]
              ]
            },
            {
              label: "Donne un avantage pertinent comme revue informelle, diffusion des connaissances, propriete collective ou qualite accrue.",
              points: 3,
              evidenceSets: [
                ["revue", "informelle"],
                ["propriete", "collective"],
                ["connaissance"],
                ["qualite"]
              ]
            },
            {
              label: "Donne un inconvenient plausible comme cout apparent, fatigue ou dependance a une bonne communication.",
              points: 3,
              evidenceSets: [["cout"], ["fatigue"], ["communication"], ["moins", "efficace"]]
            }
          ],
          modelAnswer:
            "La programmation par paire consiste a faire ecrire le code de production par deux developpeurs qui travaillent ensemble sur un meme poste. Un avantage important est la revue informelle continue : des erreurs sont detectees plus tot et la connaissance se diffuse davantage dans l'equipe. Cela favorise aussi la propriete collective du code. Un inconvenient est qu'elle peut sembler plus couteuse a court terme ou devenir fatigante si la communication dans la paire est mauvaise."
        },
        {
          id: "semi-4",
          type: "written",
          responseStyle: "semi",
          topic: "Jeu de planification",
          points: 8,
          guidance: "Attendu : 5 a 7 lignes. Distingue clairement ce que decide le client et ce qu'apportent les developpeurs.",
          prompt:
            "Explique le partage des responsabilites dans le jeu de planification XP. Que decide le client et qu'apportent les developpeurs ?",
          source: "Examens.md : questions sur les droits du client et la planification. Cours pages 25 a 33.",
          criteria: [
            {
              label: "Explique que le client choisit la valeur, les priorites, les recits ou le but de la livraison.",
              points: 3,
              evidenceSets: [
                ["client", "priorit"],
                ["client", "valeur"],
                ["client", "recit"],
                ["client", "but"]
              ]
            },
            {
              label: "Explique que les developpeurs fournissent les estimations, l'effort, les contraintes ou la faisabilite technique.",
              points: 3,
              evidenceSets: [
                ["developpeur", "estim"],
                ["effort"],
                ["contrainte", "technique"],
                ["faisabilite"]
              ]
            },
            {
              label: "Montre que cette repartition permet des decisions realistes et mieux alignees.",
              points: 2,
              evidenceSets: [["realiste"], ["align"], ["feedback", "rapide"], ["equilibre"]]
            }
          ],
          modelAnswer:
            "Dans le jeu de planification XP, le client decide ce qui a de la valeur et fixe les priorites de livraison. Il choisit donc les recits a realiser et l'objectif de l'iteration ou de la version. Les developpeurs, eux, apportent leur evaluation technique : estimation de l'effort, complexite, contraintes et faisabilite. Le client ne devrait pas imposer les decisions techniques, et les developpeurs ne devraient pas decider seuls de la valeur d'affaire. Cette repartition permet une planification plus realiste et mieux alignee sur les besoins."
        }
      ]
    },
    {
      id: "dev",
      label: "Developpement",
      title: "Partie 3 - Questions developpement",
      accent: "plum",
      instructions:
        "Reponds de facon structuree et nuancee. On attend une mise en contexte, une comparaison et une justification solide.",
      questions: [
        {
          id: "dev-1",
          type: "written",
          responseStyle: "essay",
          topic: "Agile versus discipline",
          points: 10,
          guidance:
            "Attendu : 8 a 10 lignes. Compare l'approche agile et l'approche disciplinee, puis donne un contexte precis ou l'approche disciplinee est preferable.",
          prompt:
            "Explique pourquoi la plupart des projets de developpement logiciel privilegient une approche opportuniste ou agile. Distingue-la clairement d'une approche systematique ou disciplinee et cite un contexte precis ou l'approche disciplinee est la plus appropriee.",
          source: "Examens.md : question sur opportuniste vs systematique. Cours pages 15, 18 a 20, 46 a 49 et 57.",
          criteria: [
            {
              label: "Explique pourquoi l'agilite est privilegiee : besoins changeants, vitesse, feedback rapide et livraisons incrementales.",
              points: 3,
              evidenceSets: [
                ["besoin", "changent"],
                ["vitesse"],
                ["feedback", "rapide"],
                ["livraison", "increment"]
              ]
            },
            {
              label: "Distingue l'approche disciplinee par plus de planification, de conception detaillee, de documentation ou de tracabilite.",
              points: 3,
              evidenceSets: [
                ["planification"],
                ["documentation"],
                ["conception", "detail"],
                ["traceabil"]
              ]
            },
            {
              label: "Donne un contexte precis ou l'approche disciplinee est preferable, par exemple systeme critique, reglemente, grand projet multi-equipes ou longue duree de vie.",
              points: 2,
              evidenceSets: [
                ["critique"],
                ["reglement"],
                ["multi", "equipe"],
                ["longue", "duree"]
              ]
            },
            {
              label: "Montre que le choix depend du contexte et non d'un dogme.",
              points: 2,
              evidenceSets: [["contexte"], ["hybride"], ["adapter", "approche"], ["pas", "dogme"]]
            }
          ],
          modelAnswer:
            "La plupart des projets privilegient une approche agile parce que les besoins changent, que le temps de reaction compte et qu'il faut obtenir rapidement du feedback. L'agilite mise donc sur des livraisons frequentes, une planification adaptative et une forte collaboration. Une approche disciplinee investit davantage dans la planification, la conception detaillee, la documentation et la tracabilite. Elle est plus appropriee dans des contextes ou les contraintes sont fortes, par exemple pour un systeme critique ou fortement reglemente, ou encore pour un grand projet reparti entre plusieurs equipes. Le cours rappelle cependant que le bon choix depend du contexte : en pratique, les approches hybrides sont souvent les plus performantes."
        },
        {
          id: "dev-2",
          type: "written",
          responseStyle: "essay",
          topic: "Tests, TDD et qualite",
          points: 10,
          guidance:
            "Attendu : 7 a 10 lignes. Explique le lien entre tests et qualite, puis precise ce que le TDD ne garantit pas a lui seul.",
          prompt:
            "Explique la relation qui existe entre les tests et la qualite d'un logiciel. Est-ce que les tests ou le TDD permettent de creer la qualite lors du developpement logiciel ? Justifie ta reponse.",
          source: "Examens.md : question sur tests et qualite. Cours pages 37, 43 et 44.",
          criteria: [
            {
              label: "Explique que les tests verifient ou revelent la qualite, mais ne remplacent pas une bonne conception.",
              points: 3,
              evidenceSets: [
                ["verif", "qualit"],
                ["revele", "probleme"],
                ["ne", "remplace", "conception"],
                ["information", "qualit"]
              ]
            },
            {
              label: "Explique que le TDD fournit un feedback rapide et aide a structurer l'implementation.",
              points: 2,
              evidenceSets: [
                ["feedback", "rapide"],
                ["test", "avant"],
                ["structur", "implementation"],
                ["unitaire", "avant"]
              ]
            },
            {
              label: "Mentionne les limites du TDD : pas de couverture complete garantie et difficultes avec certains tests systeme ou globaux.",
              points: 3,
              evidenceSets: [
                ["couverture", "complete"],
                ["test", "systeme"],
                ["global"],
                ["pas", "suffisant"]
              ]
            },
            {
              label: "Conclut que la qualite depend aussi d'autres pratiques comme refactoring, conception simple, integration continue ou collaboration.",
              points: 2,
              evidenceSets: [
                ["refactoring"],
                ["conception simple"],
                ["integration continue"],
                ["collaboration"]
              ]
            }
          ],
          modelAnswer:
            "Les tests sont essentiels parce qu'ils permettent de verifier le comportement du logiciel et de reveler des defauts. Ils donnent donc de l'information sur la qualite, mais ils ne creent pas a eux seuls un bon logiciel. Le TDD aide a obtenir du feedback rapide et a structurer l'implementation autour de comportements verifiables. Cependant, le cours rappelle qu'il ne garantit pas une couverture complete : certains tests systeme ou certaines proprietes globales sont difficiles a faire emerger incrementiellement. La qualite depend donc aussi d'une bonne conception, du refactoring, de l'integration continue et d'une collaboration efficace avec le client."
        },
        {
          id: "dev-3",
          type: "written",
          responseStyle: "essay",
          topic: "Agilite dans les grands projets",
          points: 10,
          guidance:
            "Attendu : 8 a 10 lignes. Nomme au moins deux difficultes et deux adaptations proposees par le cours.",
          prompt:
            "Quels sont les principaux defis de l'agilite dans les grands projets et quelles adaptations le cours suggere-t-il pour y repondre ?",
          source: "Examens.md : question sur le defi de l'agilite a grande echelle. Cours pages 52 a 54.",
          criteria: [
            {
              label: "Identifie des difficultes comme plusieurs equipes, systemes existants, utilisateurs multiples, contraintes externes ou exigences moins flexibles.",
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
              label: "Explique que la cohesion et la communication sont plus difficiles a maintenir sur la duree.",
              points: 2,
              evidenceSets: [
                ["cohesion"],
                ["communication", "equipes"],
                ["continuite", "equipe"],
                ["longue", "periode"]
              ]
            },
            {
              label: "Propose davantage de conception ou de documentation sur les aspects critiques.",
              points: 2,
              evidenceSets: [
                ["davantage", "conception"],
                ["documentation", "critique"],
                ["aspect", "critique"]
              ]
            },
            {
              label: "Propose des mecanismes de communication inter-equipes ou des canaux ouverts.",
              points: 2,
              evidenceSets: [
                ["communication", "inter", "equipes"],
                ["canaux", "ouverts"],
                ["mecanisme", "communication"]
              ]
            }
          ],
          modelAnswer:
            "Dans les grands projets, l'agilite rencontre plusieurs difficultes : presence de plusieurs equipes, integration avec des systemes existants, contraintes externes, utilisateurs differents et exigences moins flexibles sur certains aspects. Sur des projets longs, il est aussi plus difficile de maintenir la cohesion et la continuite de l'equipe. Le cours suggere alors d'adapter l'agilite plutot que de l'abandonner : il faut introduire davantage d'activites de conception et produire de la documentation sur les aspects critiques du systeme. Il faut aussi etablir de vrais mecanismes de communication entre les equipes afin de garder les canaux ouverts."
        }
      ]
    },
    {
      id: "code",
      label: "Code",
      title: "Partie 4 - Questions par rapport au code",
      accent: "slate",
      instructions:
        "Observe le code ou la configuration proposes, puis reponds comme dans un examen : identification du probleme, justification et correction.",
      questions: [
        {
          id: "code-1",
          type: "code",
          responseStyle: "code",
          topic: "Jeu de planification et separation des roles",
          points: 8,
          language: "java",
          codeSnippet:
`public class PlanningService {
    public SprintPlan plan(List<UserStory> stories) {
        stories.sort((a, b) -> b.getBusinessValue() - a.getBusinessValue());

        for (UserStory story : stories) {
            if (story.getBusinessValue() > 80) {
                story.setEstimateDays(1);
            } else {
                story.setEstimateDays(5);
            }
        }

        return new SprintPlan(stories);
    }
}`,
          guidance:
            "Attendu : 5 a 7 lignes. Identifie deux problemes importants lies a XP et propose une correction.",
          prompt:
            "Examine le code ci-dessus. Il contient deux problemes majeurs par rapport au partage des responsabilites dans XP. Identifie-les et explique brievement comment tu les corrigerais.",
          source: "Inspire du style des questions de code dans examens.md, applique aux notions XP du chapitre.",
          criteria: [
            {
              label: "Identifie que le meme service prend a la fois des decisions d'affaire ou de priorisation et des decisions techniques d'estimation.",
              points: 4,
              evidenceSets: [
                ["priorit", "estimation"],
                ["valeur", "affaire"],
                ["client", "developpeur"],
                ["melange", "responsabil"]
              ]
            },
            {
              label: "Propose de laisser la priorisation au client ou au product owner et l'estimation aux developpeurs.",
              points: 4,
              evidenceSets: [
                ["client", "priorit"],
                ["developpeur", "estim"],
                ["separer", "roles"],
                ["jeu de planification"]
              ]
            }
          ],
          modelAnswer:
            "Le premier probleme est que le service melange deux types de decisions qui devraient rester separees en XP : la priorisation d'affaire et l'estimation technique. La valeur d'affaire d'un recit ne devrait pas directement produire une estimation technique automatique. Le deuxieme probleme est que la logique suppose qu'un seuil de valeur determine le temps de developpement, ce qui est faux. Pour corriger cela, il faudrait laisser au client la priorisation des recits et aux developpeurs la responsabilite d'estimer l'effort selon des criteres techniques explicites."
        },
        {
          id: "code-2",
          type: "code",
          responseStyle: "code",
          topic: "Simplicite et reusinage",
          points: 8,
          language: "java",
          codeSnippet:
`public double totalFor(User user, List<Item> items) {
    double total = 0;
    for (Item item : items) {
        if (user.isVip()) {
            total += item.getPrice() * 0.83;
        } else {
            total += item.getPrice() * 0.94;
        }
    }

    if (user.isVip()) {
        total = total - 12;
    } else {
        total = total - 4;
    }

    return total;
}`,
          guidance:
            "Attendu : 5 a 7 lignes. Identifie au moins deux ameliorations de clean code / XP sans changer le comportement.",
          prompt:
            "En te basant sur les principes XP de simplicite et de reusinage, identifie deux ameliorations importantes dans ce code et explique en quoi elles seraient utiles.",
          source: "Inspire du style de questions de code d'examen et des pratiques XP de conception simple et refactoring.",
          criteria: [
            {
              label: "Identifie la presence de duplication ou de logique repetee autour du statut VIP.",
              points: 3,
              evidenceSets: [
                ["duplication"],
                ["repete"],
                ["vip", "plusieurs"],
                ["meme logique"]
              ]
            },
            {
              label: "Identifie les nombres magiques ou le manque de noms explicites pour les remises et frais.",
              points: 2,
              evidenceSets: [
                ["magique"],
                ["0 83"],
                ["0 94"],
                ["12"],
                ["4"],
                ["constante"]
              ]
            },
            {
              label: "Propose un reusinage concret comme extraire des fonctions, nommer des constantes ou encapsuler une politique de calcul.",
              points: 3,
              evidenceSets: [
                ["extraire", "fonction"],
                ["constante"],
                ["encapsul"],
                ["politique"],
                ["refactor"]
              ]
            }
          ],
          modelAnswer:
            "Ce code viole d'abord la simplicite parce qu'il repete plusieurs fois le test sur le statut VIP et disperse la logique de calcul. Il contient aussi plusieurs nombres magiques comme 0.83, 0.94, 12 et 4, qui rendent l'intention difficile a comprendre et a faire evoluer. Un bon reusinage serait d'extraire des fonctions nommees comme appliquerRemise et appliquerFrais, puis de remplacer les valeurs brutes par des constantes explicites. On pourrait meme encapsuler la politique de calcul selon le type d'utilisateur."
        },
        {
          id: "code-3",
          type: "code",
          responseStyle: "code",
          topic: "Integration continue et tests",
          points: 8,
          language: "yaml",
          codeSnippet:
`name: release

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
      - run: npm test`,
          guidance:
            "Attendu : 4 a 6 lignes. Explique pourquoi cette configuration est problematique et propose l'ordre correct.",
          prompt:
            "Cette configuration d'automatisation respecte-t-elle l'esprit de l'integration continue et des pratiques XP ? Identifie le probleme principal et propose une correction.",
          source: "Inspire des questions d'examen sur integration continue, tests et qualite.",
          criteria: [
            {
              label: "Explique que le deploiement est lance avant les tests, ce qui contredit l'objectif de valider avant d'integrer ou livrer.",
              points: 4,
              evidenceSets: [
                ["deploi", "avant", "test"],
                ["tester", "avant"],
                ["valider", "avant"],
                ["probleme", "ordre"]
              ]
            },
            {
              label: "Propose un flux corrige avec tests avant deploiement et idealement build ou verification avant livraison.",
              points: 4,
              evidenceSets: [
                ["tests", "avant", "deploi"],
                ["build"],
                ["verification"],
                ["pipeline", "corrige"],
                ["si", "tests", "reuss"]
              ]
            }
          ],
          modelAnswer:
            "Cette configuration ne respecte pas l'esprit de l'integration continue parce qu'elle deploie avant de tester. En XP, l'idee est au contraire de valider rapidement le nouveau code et de garder une base integree saine. Si les tests echouent apres le deploiement, on a deja mis en circulation une version potentiellement defectueuse. Il faudrait inverser l'ordre : installer les dependances, executer les tests, faire eventuellement le build, puis deployer seulement si toutes les verifications reussissent."
        }
      ]
    }
  ]
};

export function flattenQuestions(exam = examBlueprint) {
  return exam.sections.flatMap((section) =>
    section.questions.map((question, index) => ({
      ...question,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionLabel: section.label,
      sectionAccent: section.accent,
      orderInSection: index + 1
    }))
  );
}
