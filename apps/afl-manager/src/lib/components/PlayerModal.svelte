<script lang="ts">
  import type { Player } from '../types';

  interface Props {
    player: Player;
    onClose: () => void;
  }

  let { player, onClose }: Props = $props();

  function getAttributeColor(value: number): string {
    if (value >= 85) return '#00ff88';
    if (value >= 70) return '#00d4ff';
    if (value >= 55) return '#ffaa00';
    return '#ff6b6b';
  }

  function getFormRating(form: number): string {
    if (form >= 85) return 'Excellent';
    if (form >= 70) return 'Good';
    if (form >= 55) return 'Average';
    if (form >= 40) return 'Poor';
    return 'Very Poor';
  }

  let overallRating = $derived(() => {
    const attrs = player.attributes;
    const total = attrs.kicking + attrs.marking + attrs.handballing + attrs.tackling +
                  attrs.speed + attrs.endurance + attrs.strength + attrs.agility;
    return Math.round(total / 8);
  });
</script>

<div class="modal-backdrop" onclick={onClose}>
  <div class="player-modal" onclick={(e) => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>✕</button>

    <div class="player-header">
      <div class="player-number">#{player.number}</div>
      <div class="player-info">
        <h2>{player.firstName} {player.lastName}</h2>
        <div class="player-meta">
          <span class="position">{player.position}</span>
          <span class="age">{player.age} years old</span>
          {#if player.injured}
            <span class="injury-status">INJURED ({player.injuryWeeks} weeks)</span>
          {/if}
        </div>
      </div>
      <div class="overall-rating" style="border-color: {getAttributeColor(overallRating)}">
        <span class="rating-value">{overallRating}</span>
        <span class="rating-label">OVR</span>
      </div>
    </div>

    <div class="player-stats-grid">
      <div class="stat-card">
        <div class="stat-label">Form</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: {player.form}%; background: {getAttributeColor(player.form)}"></div>
        </div>
        <div class="stat-value" style="color: {getAttributeColor(player.form)}">
          {Math.round(player.form)} - {getFormRating(player.form)}
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Fitness</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: {player.fitness}%; background: {getAttributeColor(player.fitness)}"></div>
        </div>
        <div class="stat-value" style="color: {getAttributeColor(player.fitness)}">
          {Math.round(player.fitness)}%
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Morale</div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: {player.morale}%; background: {getAttributeColor(player.morale)}"></div>
        </div>
        <div class="stat-value" style="color: {getAttributeColor(player.morale)}">
          {Math.round(player.morale)}%
        </div>
      </div>
    </div>

    <div class="attributes-section">
      <h3>Attributes</h3>
      <div class="attributes-grid">
        {#each Object.entries(player.attributes) as [key, value]}
          <div class="attribute-item">
            <div class="attr-header">
              <span class="attr-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span class="attr-value" style="color: {getAttributeColor(value)}">{Math.round(value)}</span>
            </div>
            <div class="attr-bar-container">
              <div class="attr-bar" style="width: {value}%; background: {getAttributeColor(value)}"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="career-stats">
      <h3>Career Statistics</h3>
      <div class="career-grid">
        <div class="career-stat">
          <span class="career-value">{player.gamesPlayed}</span>
          <span class="career-label">Games</span>
        </div>
        <div class="career-stat">
          <span class="career-value">{player.goals}</span>
          <span class="career-label">Goals</span>
        </div>
        <div class="career-stat">
          <span class="career-value">{player.behinds}</span>
          <span class="career-label">Behinds</span>
        </div>
        <div class="career-stat">
          <span class="career-value">{player.disposals}</span>
          <span class="career-label">Disposals</span>
        </div>
        <div class="career-stat">
          <span class="career-value">{player.marks}</span>
          <span class="career-label">Marks</span>
        </div>
        <div class="career-stat">
          <span class="career-value">{player.tackles}</span>
          <span class="career-label">Tackles</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .player-modal {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 2px solid #00d4ff;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s ease-out;
    box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #ff4444;
    border-color: #ff4444;
    transform: rotate(90deg);
  }

  .player-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 2px solid rgba(0, 212, 255, 0.3);
  }

  .player-number {
    font-size: 3rem;
    font-weight: 900;
    color: #00d4ff;
    opacity: 0.5;
  }

  .player-info {
    flex: 1;
  }

  .player-info h2 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #fff;
  }

  .player-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .position,
  .age {
    padding: 0.25rem 0.75rem;
    background: rgba(0, 212, 255, 0.2);
    border: 1px solid rgba(0, 212, 255, 0.5);
    border-radius: 4px;
    font-size: 0.875rem;
    color: #00d4ff;
    font-weight: 600;
  }

  .injury-status {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 68, 68, 0.2);
    border: 1px solid rgba(255, 68, 68, 0.5);
    border-radius: 4px;
    font-size: 0.875rem;
    color: #ff4444;
    font-weight: 600;
  }

  .overall-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border: 3px solid;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
  }

  .rating-value {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
  }

  .rating-label {
    font-size: 0.75rem;
    color: #aaa;
  }

  .player-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 2rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-label {
    font-size: 0.875rem;
    color: #aaa;
    margin-bottom: 0.5rem;
  }

  .stat-bar-container {
    height: 8px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .stat-bar {
    height: 100%;
    transition: width 0.5s ease-out;
  }

  .stat-value {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .attributes-section,
  .career-stats {
    padding: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .attributes-section h3,
  .career-stats h3 {
    margin: 0 0 1.5rem 0;
    color: #00d4ff;
  }

  .attributes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .attribute-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .attr-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .attr-name {
    font-size: 0.875rem;
    color: #ccc;
  }

  .attr-value {
    font-weight: 700;
    font-size: 1rem;
  }

  .attr-bar-container {
    height: 6px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    overflow: hidden;
  }

  .attr-bar {
    height: 100%;
    transition: width 0.5s ease-out;
  }

  .career-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .career-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 8px;
  }

  .career-value {
    font-size: 2rem;
    font-weight: 900;
    color: #00d4ff;
  }

  .career-label {
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    .player-header {
      flex-direction: column;
      text-align: center;
    }

    .player-stats-grid {
      grid-template-columns: 1fr;
    }

    .attributes-grid {
      grid-template-columns: 1fr;
    }

    .career-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
