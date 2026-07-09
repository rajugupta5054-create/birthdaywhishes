import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
PADDLE_WIDTH, PADDLE_HEIGHT = 15, 100
BALL_SIZE = 15
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Screen setup
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")
clock = pygame.time.Clock()

# Fonts
font = pygame.font.SysFont(None, 74)

class Paddle:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.speed = 7

    def move(self, up_key, down_key, keys):
        if keys[up_key] and self.rect.top > 0:
            self.rect.y -= self.speed
        if keys[down_key] and self.rect.bottom < HEIGHT:
            self.rect.y += self.speed

    def draw(self, surface):
        pygame.draw.rect(surface, WHITE, self.rect)

class Ball:
    def __init__(self):
        self.rect = pygame.Rect(WIDTH // 2 - BALL_SIZE // 2, HEIGHT // 2 - BALL_SIZE // 2, BALL_SIZE, BALL_SIZE)
        self.speed_x = 5
        self.speed_y = 5

    def move(self):
        self.rect.x += self.speed_x
        self.rect.y += self.speed_y

        # Bounce off top and bottom walls
        if self.rect.top <= 0 or self.rect.bottom >= HEIGHT:
            self.speed_y *= -1

    def draw(self, surface):
        pygame.draw.ellipse(surface, WHITE, self.rect)

    def reset(self):
        self.rect.center = (WIDTH // 2, HEIGHT // 2)
        self.speed_x *= -1 # Serve to the other player

def main():
    player1 = Paddle(30, HEIGHT // 2 - PADDLE_HEIGHT // 2)
    player2 = Paddle(WIDTH - 30 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2)
    ball = Ball()

    score1 = 0
    score2 = 0

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        keys = pygame.key.get_pressed()
        player1.move(pygame.K_w, pygame.K_s, keys)
        player2.move(pygame.K_UP, pygame.K_DOWN, keys)
        
        ball.move()

        # Collision with paddles
        if ball.rect.colliderect(player1.rect) and ball.speed_x < 0:
            ball.speed_x *= -1
            ball.rect.left = player1.rect.right
        if ball.rect.colliderect(player2.rect) and ball.speed_x > 0:
            ball.speed_x *= -1
            ball.rect.right = player2.rect.left

        # Scoring
        if ball.rect.left <= 0:
            score2 += 1
            ball.reset()
        if ball.rect.right >= WIDTH:
            score1 += 1
            ball.reset()

        # Drawing
        screen.fill(BLACK)
        
        # Draw center line
        pygame.draw.aaline(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

        player1.draw(screen)
        player2.draw(screen)
        ball.draw(screen)

        # Draw scores
        score_text1 = font.render(str(score1), True, WHITE)
        score_text2 = font.render(str(score2), True, WHITE)
        screen.blit(score_text1, (WIDTH // 4, 20))
        screen.blit(score_text2, (WIDTH * 3 // 4, 20))

        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
