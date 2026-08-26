import { Passage } from '../types';

export const PASSAGES: Passage[] = [
  {
    id: 'reef',
    title: 'The Architects of the Reef',
    category: 'Science',
    level: 'Easy',
    text: "Coral reefs cover less than one percent of the ocean floor, yet they shelter almost a quarter of all known marine species. A single reef is not one animal but millions of tiny polyps, each secreting a limestone cup around its own body. Over centuries these cups stack into branching towers and flat plates, building a skeleton large enough to be seen from space. The polyps survive by hosting microscopic algae inside their tissue. The algae turn sunlight into sugar and share it with their host, and in return the polyp offers shelter and a steady supply of carbon dioxide. This partnership is so tight that when ocean water grows too warm, the stressed polyps expel their algae, exposing the white skeleton beneath in an event called bleaching. A bleached reef is not automatically dead, but it is starving, and if warm water lingers for weeks the colony often cannot recover. Because reefs grow so slowly, a bleaching event can undo centuries of growth in a single season, which is why marine biologists track sea temperature as closely as a physician tracks a patient's fever.",
    questions: [
      {
        question: 'What role do the algae play for coral polyps?',
        options: [
          'They defend the polyp from predators',
          'They convert sunlight into sugar the polyp uses for energy',
          'They filter waste out of the water',
          'They help the polyp reproduce'
        ],
        correctIndex: 1,
        explanation: 'The passage says algae turn sunlight into sugar and share it with their host polyp.'
      },
      {
        question: 'What happens during coral bleaching?',
        options: [
          'The polyps grow a thicker skeleton',
          'The polyps expel their algae, exposing white skeleton',
          'The reef instantly dies',
          'The reef changes color to attract fish'
        ],
        correctIndex: 1,
        explanation: 'Bleaching happens when stressed polyps expel their algae, revealing the white skeleton.'
      },
      {
        question: 'Why do biologists closely track sea temperature?',
        options: [
          'Warmer water helps reefs grow faster',
          'Prolonged warm water can trigger bleaching that undoes centuries of growth',
          'Cooler water causes bleaching',
          'Temperature has no effect on reefs'
        ],
        correctIndex: 1,
        explanation: 'Because reefs grow slowly, prolonged warm water can undo centuries of growth in one season.'
      }
    ]
  },
  {
    id: 'sleep',
    title: 'What the Brain Does While You Sleep',
    category: 'Health Science',
    level: 'Medium',
    text: "For a long time, sleep was thought of as downtime, a pause between two more important states. Modern research paints a busier picture. During the deep stages of non-REM sleep, the brain replays fragments of the day's activity, strengthening the neural connections tied to things worth remembering and letting weaker, less useful connections fade. This process, often called consolidation, is one reason students who sleep after studying tend to retain more than students who pull an all-nighter and skip sleep entirely. REM sleep, the stage associated with vivid dreaming, appears to do something different: it seems to help the brain link new information to older knowledge, which may be why unusual or creative solutions to problems often arrive after a night of sleep rather than during a session of focused effort. Sleep also allows the glymphatic system, a network of channels that only opens fully during rest, to clear metabolic waste that builds up in brain tissue during waking hours. Chronic short sleep does not just make a person feel tired; it appears to leave this cleanup process incomplete night after night, which researchers suspect contributes to the fog and irritability that follow a stretch of poor sleep.",
    questions: [
      {
        question: 'What happens to weaker neural connections during non-REM sleep, according to the passage?',
        options: [
          'They are strengthened along with everything else',
          'They tend to fade while useful connections are strengthened',
          'They are transferred to REM sleep for storage',
          'The passage does not mention this'
        ],
        correctIndex: 1,
        explanation: 'The passage says weaker, less useful connections tend to fade during consolidation.'
      },
      {
        question: 'What does REM sleep seem to help with, based on the passage?',
        options: [
          'Clearing metabolic waste',
          'Linking new information to older knowledge',
          'Building muscle memory',
          'Regulating body temperature'
        ],
        correctIndex: 1,
        explanation: 'REM sleep appears to help link new information with older knowledge, aiding creative problem-solving.'
      },
      {
        question: 'What is the glymphatic system described as doing?',
        options: [
          'Producing new neurons',
          'Clearing metabolic waste from brain tissue during rest',
          'Generating dreams',
          'Storing long-term memories'
        ],
        correctIndex: 1,
        explanation: "It's described as a channel network that clears metabolic waste, opening fully during rest."
      }
    ]
  }
];
