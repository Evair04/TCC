<?php
namespace DoctrineExtensions\Query\Postgresql;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;

class StrReplace extends FunctionNode
{
    /**
     * {@inheritdoc}
     */
    public $stringPrimary;
    
    public function getSql(SqlWalker $sqlWalker)
    {
        return 'REPLACE(' . $this->subject->dispatch($sqlWalker) . ', ' . $this->from->dispatch($sqlWalker) . ', ' . $this->to->dispatch($sqlWalker) . ')';
    }

    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->subject = $parser->StringPrimary();
        $parser->match(Lexer::T_COMMA);
        $this->from = $parser->StringPrimary();
        $parser->match(Lexer::T_COMMA);
        $this->to = $parser->StringPrimary();
        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
}