import streamlit as st
import json
from datetime import datetime, timedelta
import plotly.graph_objects as go
import plotly.express as px

# Page config
st.set_page_config(
    page_title="Focus - Productivity RPG",
    page_icon="🎮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stMetric {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #667eea;
    }
    </style>
""", unsafe_allow_html=True)

# Initialize session state
if 'player' not in st.session_state:
    st.session_state.player = {
        'name': 'Player',
        'level': 1,
        'xp': 0,
        'xpToNextLevel': 1000,
        'gold': 0,
        'streak': 0,
        'totalFocusTime': 0,
        'class': None,
        'skillPoints': 0,
        'skills': {},
        'pet': {
            'name': 'Dragon',
            'type': 'dragon',
            'stage': 'baby',
            'happiness': 50,
            'xp': 0
        }
    }

if 'quests' not in st.session_state:
    st.session_state.quests = []

if 'sessions' not in st.session_state:
    st.session_state.sessions = []

if 'achievements' not in st.session_state:
    st.session_state.achievements = []

# Sidebar
with st.sidebar:
    st.title("⚙️ Settings")
    
    # Player name
    st.session_state.player['name'] = st.text_input(
        "Player Name",
        value=st.session_state.player['name']
    )
    
    # Class selection
    if not st.session_state.player['class']:
        st.subheader("Choose Your Class")
        class_choice = st.radio(
            "Select a class:",
            ["Scholar", "Monk", "Warrior", "Alchemist"],
            captions=[
                "+20% Learning XP",
                "Focus sessions last longer",
                "More boss damage",
                "Bonus gold rewards"
            ]
        )
        if st.button("Select Class"):
            st.session_state.player['class'] = class_choice.lower()
            st.success(f"You are now a {class_choice}!")
            st.rerun()
    else:
        st.info(f"Class: **{st.session_state.player['class'].title()}**")

# Main content
st.title("🎮 Focus - Productivity RPG")

# Tabs
tab1, tab2, tab3, tab4 = st.tabs(["Dashboard", "Focus Session", "Quests", "Character"])

# ============ DASHBOARD TAB ============
with tab1:
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(
            "Level",
            st.session_state.player['level'],
            f"Novice" if st.session_state.player['level'] < 5 else "Apprentice"
        )
    
    with col2:
        st.metric(
            "Gold",
            st.session_state.player['gold'],
            "💰"
        )
    
    with col3:
        st.metric(
            "Streak",
            st.session_state.player['streak'],
            "🔥"
        )
    
    # XP Progress
    st.subheader("XP Progress")
    xp_percent = (st.session_state.player['xp'] / st.session_state.player['xpToNextLevel']) * 100
    st.progress(xp_percent / 100)
    st.caption(f"{st.session_state.player['xp']} / {st.session_state.player['xpToNextLevel']} XP")
    
    # Pet Status
    st.subheader("🐉 Your Pet")
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Name:** {st.session_state.player['pet']['name']}")
        st.write(f"**Type:** {st.session_state.player['pet']['type'].title()}")
        st.write(f"**Stage:** {st.session_state.player['pet']['stage'].title()}")
    
    with col2:
        st.write(f"**Happiness:** {st.session_state.player['pet']['happiness']}%")
        st.progress(st.session_state.player['pet']['happiness'] / 100)
    
    # Statistics
    st.subheader("📊 Statistics")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        hours = st.session_state.player['totalFocusTime'] // 60
        st.metric("Total Focus Time", f"{hours}h")
    
    with col2:
        st.metric("Sessions Completed", len(st.session_state.sessions))
    
    with col3:
        st.metric("Quests Created", len(st.session_state.quests))

# ============ FOCUS SESSION TAB ============
with tab2:
    st.subheader("Start a Focus Session")
    
    col1, col2 = st.columns(2)
    
    with col1:
        entertainment_time = st.slider(
            "Entertainment Time (minutes)",
            5, 120, 30
        )
    
    with col2:
        focus_time = st.slider(
            "Focus Duration (minutes)",
            10, 120, 25
        )
    
    # Quest selection
    quest_options = ["No Quest"] + [q['title'] for q in st.session_state.quests]
    selected_quest = st.selectbox("Select Quest (Optional)", quest_options)
    
    if st.button("🚀 Start Session", use_container_width=True):
        session = {
            'id': len(st.session_state.sessions) + 1,
            'startTime': datetime.now().isoformat(),
            'entertainmentDuration': entertainment_time,
            'focusDuration': focus_time,
            'questId': selected_quest if selected_quest != "No Quest" else None,
            'completed': False
        }
        st.session_state.sessions.append(session)
        
        # Calculate rewards
        xp_reward = 50 if focus_time <= 10 else 150 if focus_time <= 25 else 300 if focus_time <= 45 else 500
        
        # Apply class bonus
        if st.session_state.player['class'] == 'scholar':
            xp_reward = int(xp_reward * 1.2)
        
        gold_reward = 50
        if st.session_state.player['class'] == 'alchemist':
            gold_reward = int(gold_reward * 1.5)
        
        # Update player
        st.session_state.player['xp'] += xp_reward
        st.session_state.player['gold'] += gold_reward
        st.session_state.player['totalFocusTime'] += focus_time
        st.session_state.player['streak'] += 1
        st.session_state.player['pet']['happiness'] = min(100, st.session_state.player['pet']['happiness'] + 10)
        
        # Check level up
        if st.session_state.player['xp'] >= st.session_state.player['xpToNextLevel']:
            st.session_state.player['level'] += 1
            st.session_state.player['xp'] = 0
            st.session_state.player['xpToNextLevel'] = int(st.session_state.player['xpToNextLevel'] * 1.1)
            st.session_state.player['skillPoints'] += 1
            st.balloons()
            st.success(f"🎉 Level Up! You are now Level {st.session_state.player['level']}")
        
        st.success(f"✅ Session Completed!\n\n+{xp_reward} XP\n+{gold_reward} Gold")
        st.rerun()
    
    # Recent sessions
    if st.session_state.sessions:
        st.subheader("Recent Sessions")
        for session in reversed(st.session_state.sessions[-5:]):
            col1, col2, col3 = st.columns(3)
            with col1:
                st.write(f"**Focus:** {session['focusDuration']}m")
            with col2:
                st.write(f"**Entertainment:** {session['entertainmentDuration']}m")
            with col3:
                st.write(f"**Quest:** {session['questId'] or 'None'}")

# ============ QUESTS TAB ============
with tab3:
    st.subheader("Create a Quest")
    
    col1, col2 = st.columns(2)
    
    with col1:
        quest_title = st.text_input("Quest Title")
    
    with col2:
        quest_reward = st.number_input("XP Reward", 50, 1000, 200)
    
    quest_description = st.text_area("Description")
    quest_difficulty = st.selectbox("Difficulty", ["Easy", "Medium", "Hard"])
    
    if st.button("✨ Create Quest", use_container_width=True):
        if quest_title:
            quest = {
                'id': len(st.session_state.quests) + 1,
                'title': quest_title,
                'description': quest_description,
                'reward': quest_reward,
                'difficulty': quest_difficulty.lower(),
                'completed': False
            }
            st.session_state.quests.append(quest)
            st.success(f"Quest '{quest_title}' created!")
            st.rerun()
        else:
            st.error("Please enter a quest title")
    
    # Display quests
    if st.session_state.quests:
        st.subheader("Your Quests")
        for quest in st.session_state.quests:
            col1, col2, col3 = st.columns([3, 1, 1])
            
            with col1:
                st.write(f"**{quest['title']}**")
                st.caption(quest['description'])
            
            with col2:
                difficulty_color = "🟢" if quest['difficulty'] == 'easy' else "🟡" if quest['difficulty'] == 'medium' else "🔴"
                st.write(f"{difficulty_color} {quest['difficulty'].title()}")
            
            with col3:
                st.write(f"+{quest['reward']} XP")

# ============ CHARACTER TAB ============
with tab4:
    st.subheader("Character Profile")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Name:** {st.session_state.player['name']}")
        st.write(f"**Level:** {st.session_state.player['level']}")
        st.write(f"**Class:** {st.session_state.player['class'].title() if st.session_state.player['class'] else 'Not Selected'}")
    
    with col2:
        st.write(f"**Skill Points:** {st.session_state.player['skillPoints']}")
        st.write(f"**Total XP Earned:** {st.session_state.player['xp']}")
        st.write(f"**Total Gold:** {st.session_state.player['gold']}")
    
    # Skill Tree
    st.subheader("🌳 Skill Tree")
    
    skills = {
        'Deep Work': {'description': '+10% XP', 'cost': 1},
        'Focus Mastery': {'description': 'Longer streak protection', 'cost': 1},
        'Time Efficiency': {'description': 'Reduced focus requirements', 'cost': 2},
        'Discipline': {'description': 'Reduced distraction penalties', 'cost': 1}
    }
    
    col1, col2 = st.columns(2)
    
    for idx, (skill_name, skill_info) in enumerate(skills.items()):
        col = col1 if idx % 2 == 0 else col2
        
        with col:
            unlocked = st.session_state.player['skills'].get(skill_name, False)
            
            if unlocked:
                st.success(f"✅ {skill_name}")
                st.caption(skill_info['description'])
            else:
                st.info(f"🔒 {skill_name}")
                st.caption(skill_info['description'])
                
                if st.button(f"Unlock {skill_name} ({skill_info['cost']} points)", key=skill_name):
                    if st.session_state.player['skillPoints'] >= skill_info['cost']:
                        st.session_state.player['skills'][skill_name] = True
                        st.session_state.player['skillPoints'] -= skill_info['cost']
                        st.success(f"Unlocked {skill_name}!")
                        st.rerun()
                    else:
                        st.error("Not enough skill points!")

# Footer
st.divider()
st.markdown("""
    <div style='text-align: center'>
        <p>🎮 Focus - Transform Your Productivity into an RPG Adventure</p>
        <p style='font-size: 12px; color: gray;'>Made with ❤️ for productivity enthusiasts</p>
    </div>
""", unsafe_allow_html=True)
