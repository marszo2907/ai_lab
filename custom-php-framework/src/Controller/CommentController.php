<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Comment;
use App\Service\Router;
use App\Service\Templating;

class CommentController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $comments = Comment::findAll();
        return $templating->render('comment/index.html.php', [
            'comments' => $comments,
            'router' => $router,
        ]);
    }

    public function createAction(?array $requestComment, Templating $templating, Router $router): ?string
    {
        if ($requestComment) {
            $comment = Comment::fromArray($requestComment);
            $comment->save();

            $path = $router->generatePath('comment-index');
            $router->redirect($path);
            return null;
        } else {
            $comment = new Comment();
        }

        return $templating->render('comment/create.html.php', [
            'comment' => $comment,
            'router' => $router,
        ]);
    }

    public function editAction(int $commentId,
                               ?array $requestComment,
                               Templating $templating,
                               Router $router): ?string
    {
        $comment = Comment::findById($commentId);
        if (! $comment) {
            throw new NotFoundException("Missing comment with id $commentId");
        }

        if ($requestComment) {
            $comment->fill($requestComment);
            $comment->save();

            $path = $router->generatePath('comment-index');
            $router->redirect($path);
            return null;
        }

        return $templating->render('comment/edit.html.php', [
            'comment' => $comment,
            'router' => $router,
        ]);
    }

    public function showAction(int $commentId, Templating $templating, Router $router): ?string
    {
        $comment = Comment::findById($commentId);
        if (! $comment) {
            throw new NotFoundException("Missing comment with id $commentId");
        }

        return $templating->render('comment/show.html.php', [
            'comment' => $comment,
            'router' => $router,
        ]);
    }

    public function deleteAction(int $commentId, Router $router): ?string
    {
        $comment = Comment::findById($commentId);
        if (! $comment) {
            throw new NotFoundException("Missing comment with id $commentId");
        }

        $comment->delete();
        $path = $router->generatePath('comment-index');
        $router->redirect($path);
        return null;
    }


}